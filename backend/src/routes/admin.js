import express from "express";
import Order from "../models/Order.js";
import Table from "../models/Table.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import ExtraCharge from "../models/ExtraCharge.js";

const router = express.Router();

// Dashboard stats
router.get("/dashboard/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's stats
    const [
      todayOrders,
      todayRevenue,
      activeTables,
      totalTables,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments({
        restaurant_id: restaurantId,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      Order.aggregate([
        {
          $match: {
            restaurant_id: restaurantId,
            createdAt: { $gte: today, $lt: tomorrow },
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$total_amount" } } },
      ]),
      Table.countDocuments({
        restaurant_id: restaurantId,
        status: "occupied",
      }),
      Table.countDocuments({
        restaurant_id: restaurantId,
        is_active: true,
      }),
      Order.countDocuments({
        restaurant_id: restaurantId,
        status: "pending",
      }),
      Order.countDocuments({
        restaurant_id: restaurantId,
        status: "preparing",
      }),
      Order.countDocuments({
        restaurant_id: restaurantId,
        status: "ready",
      }),
      Order.countDocuments({
        restaurant_id: restaurantId,
        status: "completed",
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      Order.find({
        restaurant_id: restaurantId,
      })
        .populate("table_id")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calculate average order value
    const avgOrderValue = await Order.aggregate([
      {
        $match: {
          restaurant_id: restaurantId,
          createdAt: { $gte: today, $lt: tomorrow },
          status: "completed",
        },
      },
      { $group: { _id: null, avg: { $avg: "$total_amount" } } },
    ]);

    // Get hourly order distribution for today
    const hourlyOrders = await Order.aggregate([
      {
        $match: {
          restaurant_id: restaurantId,
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$total_amount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          todayOrders,
          todayRevenue: todayRevenue[0]?.total || 0,
          activeTables,
          totalTables,
          avgOrderValue: avgOrderValue[0]?.avg || 0,
          orderStatus: {
            pending: pendingOrders,
            preparing: preparingOrders,
            ready: readyOrders,
            completed: completedOrders,
          },
        },
        recentOrders,
        hourlyOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Staff management
router.get("/staff/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const staff = await User.find({
      restaurant_id: restaurantId,
      role: { $in: ["manager", "kitchen_staff", "waiter", "delivery_boy"] },
      is_active: true,
    })
      .select("-password")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: { staff },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Create staff member
router.post("/staff", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      restaurant_id,
      permissions = [],
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone",
      });
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      role,
      restaurant_id,
      permissions,
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Extra charges management
router.get("/charges/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const charges = await ExtraCharge.find({
      restaurant_id: restaurantId,
      is_active: true,
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: { charges },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Create extra charge
router.post("/charges", async (req, res) => {
  try {
    const charge = new ExtraCharge(req.body);
    await charge.save();

    res.status(201).json({
      success: true,
      message: "Extra charge created successfully",
      data: { charge },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Update extra charge
router.put("/charges/:chargeId", async (req, res) => {
  try {
    const { chargeId } = req.params;

    const charge = await ExtraCharge.findByIdAndUpdate(chargeId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!charge) {
      return res.status(404).json({
        success: false,
        message: "Extra charge not found",
      });
    }

    res.json({
      success: true,
      message: "Extra charge updated successfully",
      data: { charge },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete extra charge
router.delete("/charges/:chargeId", async (req, res) => {
  try {
    const { chargeId } = req.params;

    const charge = await ExtraCharge.findByIdAndUpdate(
      chargeId,
      { is_active: false },
      { new: true },
    );

    if (!charge) {
      return res.status(404).json({
        success: false,
        message: "Extra charge not found",
      });
    }

    res.json({
      success: true,
      message: "Extra charge deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Reports
router.get("/reports/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate, type = "sales" } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const filter = { restaurant_id: restaurantId, ...dateFilter };

    let reportData = {};

    switch (type) {
      case "sales":
        reportData = await Order.aggregate([
          { $match: { ...filter, status: "completed" } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$total_amount" },
              avgOrderValue: { $avg: "$total_amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);
        break;

      case "items":
        reportData = await Order.aggregate([
          { $match: filter },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.menu_item_id",
              itemName: { $first: "$items.name" },
              totalQuantity: { $sum: "$items.quantity" },
              totalRevenue: {
                $sum: { $multiply: ["$items.price", "$items.quantity"] },
              },
            },
          },
          { $sort: { totalQuantity: -1 } },
          { $limit: 20 },
        ]);
        break;

      case "service":
        reportData = await Order.aggregate([
          { $match: filter },
          {
            $group: {
              _id: "$service_type",
              totalOrders: { $sum: 1 },
              totalRevenue: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "completed"] },
                    "$total_amount",
                    0,
                  ],
                },
              },
            },
          },
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid report type",
        });
    }

    res.json({
      success: true,
      data: { reportData },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
