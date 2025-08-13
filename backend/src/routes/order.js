import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// Get orders for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, service_type, limit = 50, page = 1 } = req.query;

    const filter = { restaurant_id: restaurantId };
    
    if (status) filter.status = status;
    if (service_type) filter.service_type = service_type;

    const orders = await Order.find(filter)
      .populate('table_id')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get single order
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('table_id')
      .populate('restaurant_id')
      .populate('items.menu_item_id');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create new order
router.post('/', [
  body('restaurant_id').isMongoId().withMessage('Valid restaurant ID required'),
  body('service_type').isIn(['dining', 'takeaway', 'delivery']).withMessage('Valid service type required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('items.*.menu_item_id').isMongoId().withMessage('Valid menu item ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Valid subtotal required'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Valid total amount required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      restaurant_id,
      service_type,
      table_id,
      table_number,
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      items,
      subtotal,
      tax_amount = 0,
      service_charge = 0,
      delivery_charge = 0,
      discount_amount = 0,
      total_amount,
      special_instructions,
      qr_code_id,
      payment_method = 'cash'
    } = req.body;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Validate table if dining service
    let table = null;
    if (service_type === 'dining' && table_id) {
      table = await Table.findById(table_id);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table not found'
        });
      }
    }

    // Validate menu items and calculate estimated time
    let estimatedTime = 0;
    const validatedItems = [];
    
    for (const orderItem of items) {
      const menuItem = await MenuItem.findById(orderItem.menu_item_id);
      if (!menuItem || !menuItem.is_active || menuItem.availability !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Menu item ${menuItem?.name || 'unknown'} is not available`
        });
      }

      validatedItems.push({
        menu_item_id: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: orderItem.quantity,
        special_instructions: orderItem.special_instructions || ''
      });

      // Add to estimated time (max prep time among items + extra time per quantity)
      estimatedTime = Math.max(estimatedTime, menuItem.preparation_time + (orderItem.quantity * 2));
    }

    // Create order
    const order = new Order({
      restaurant_id,
      customer_name,
      customer_phone,
      customer_email,
      service_type,
      table_id: table?._id,
      table_number: table_number || table?.table_number,
      delivery_address,
      items: validatedItems,
      subtotal,
      tax_amount,
      service_charge,
      delivery_charge,
      discount_amount,
      total_amount,
      special_instructions,
      estimated_time: estimatedTime + (service_type === 'delivery' ? 20 : 0), // Add delivery time
      qr_code_id,
      order_source: qr_code_id ? 'qr_scan' : 'app',
      payment_method,
      status: 'pending'
    });

    await order.save();

    // Update table status if dining
    if (table) {
      table.status = 'occupied';
      table.current_order = order._id;
      await table.save();
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`restaurant_${restaurant_id}`).emit('new_order', {
      orderId: order._id,
      orderNumber: order.order_number,
      serviceType: order.service_type,
      tableNumber: order.table_number,
      items: order.items.length,
      totalAmount: order.total_amount
    });

    io.to(`kitchen_${restaurant_id}`).emit('kitchen_order', {
      orderId: order._id,
      orderNumber: order.order_number,
      items: order.items,
      specialInstructions: order.special_instructions,
      estimatedTime: order.estimated_time
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update order status
router.patch('/:orderId/status', [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate('table_id');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.status;
    order.status = status;

    // Handle status-specific logic
    if (status === 'completed' || status === 'cancelled') {
      if (order.table_id) {
        // Free up the table
        await Table.findByIdAndUpdate(order.table_id._id, {
          status: 'available',
          current_order: null,
          last_used: new Date()
        });
      }
      
      if (status === 'completed') {
        order.delivery_time = new Date();
        // Calculate actual preparation time
        const prepStartTime = order.updatedAt; // Assuming updated when preparing started
        order.actual_preparation_time = Math.round((Date.now() - prepStartTime) / (1000 * 60));
      }
    }

    await order.save();

    // Emit real-time updates
    const io = req.app.get('io');
    io.to(`restaurant_${order.restaurant_id}`).emit('order_status_updated', {
      orderId: order._id,
      orderNumber: order.order_number,
      oldStatus,
      newStatus: status,
      tableNumber: order.table_number
    });

    if (order.table_id && (status === 'completed' || status === 'cancelled')) {
      io.to(`restaurant_${order.restaurant_id}`).emit('table_status_updated', {
        tableId: order.table_id._id,
        tableNumber: order.table_number,
        status: 'available'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get order analytics for dashboard
router.get('/analytics/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { period = 'today' } = req.query;

    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'today':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
          }
        };
        break;
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter = { createdAt: { $gte: weekStart } };
        break;
      case 'month':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        };
        break;
    }

    const filter = { restaurant_id: restaurantId, ...dateFilter };

    const [
      totalOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue,
      ordersByService,
      ordersByStatus
    ] = await Promise.all([
      Order.countDocuments(filter),
      Order.countDocuments({ ...filter, status: 'completed' }),
      Order.aggregate([
        { $match: { ...filter, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } }
      ]),
      Order.aggregate([
        { $match: { ...filter, status: 'completed' } },
        { $group: { _id: null, avg: { $avg: '$total_amount' } } }
      ]),
      Order.aggregate([
        { $match: filter },
        { $group: { _id: '$service_type', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgOrderValue: avgOrderValue[0]?.avg || 0,
        ordersByService: ordersByService.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
