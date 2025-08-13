import express from 'express';
import { body, validationResult } from 'express-validator';
import Table from '../models/Table.js';
import Restaurant from '../models/Restaurant.js';
import { generateTableQRCode } from '../utils/qrCodeGenerator.js';

const router = express.Router();

// Get all tables for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const tables = await Table.find({ 
      restaurant_id: restaurantId, 
      is_active: true 
    }).sort({ table_number: 1 });

    res.json({
      success: true,
      data: { tables }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get single table
router.get('/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId).populate('restaurant_id');
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      data: { table }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create new table
router.post('/', [
  body('restaurant_id').isMongoId().withMessage('Valid restaurant ID required'),
  body('chair_count').isInt({ min: 1, max: 20 }).withMessage('Chair count must be between 1-20'),
  body('location').trim().notEmpty().withMessage('Location is required')
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

    const { restaurant_id, chair_count, location, status = 'available' } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get next table number
    const lastTable = await Table.findOne({ restaurant_id }).sort({ table_number: -1 });
    const table_number = lastTable ? lastTable.table_number + 1 : 1;

    // Create table
    const table = new Table({
      restaurant_id,
      table_number,
      chair_count,
      location,
      status
    });

    await table.save();

    // Generate QR code
    const qrResult = await generateTableQRCode(
      restaurant_id,
      table_number,
      table._id,
      table.qr_code_id
    );

    if (qrResult.success) {
      table.qr_code_image = qrResult.qrCodeDataURL;
      await table.save();
    }

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: { table }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update table
router.put('/:tableId', [
  body('chair_count').optional().isInt({ min: 1, max: 20 }).withMessage('Chair count must be between 1-20'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('status').optional().isIn(['available', 'occupied', 'reserved', 'maintenance']).withMessage('Invalid status')
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

    const { tableId } = req.params;
    const updateData = req.body;

    const table = await Table.findByIdAndUpdate(
      tableId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      message: 'Table updated successfully',
      data: { table }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update table status
router.patch('/:tableId/status', [
  body('status').isIn(['available', 'occupied', 'reserved', 'maintenance']).withMessage('Invalid status')
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

    const { tableId } = req.params;
    const { status } = req.body;

    const updateData = { status };
    if (status === 'available') {
      updateData.last_used = new Date();
      updateData.current_order = null;
    }

    const table = await Table.findByIdAndUpdate(
      tableId,
      updateData,
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`restaurant_${table.restaurant_id}`).emit('table_status_updated', {
      tableId: table._id,
      tableNumber: table.table_number,
      status: table.status
    });

    res.json({
      success: true,
      message: 'Table status updated successfully',
      data: { table }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete table
router.delete('/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Check if table has active orders
    if (table.current_order) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete table with active order'
      });
    }

    // Soft delete
    table.is_active = false;
    await table.save();

    res.json({
      success: true,
      message: 'Table deleted successfully'
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
