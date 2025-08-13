import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Table from "../models/Table.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check if user is super admin
const requireSuperAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "restaurant_secret",
    );
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super admin access required",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Super Admin Dashboard Statistics
router.get("/dashboard", requireSuperAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get overall statistics
    const [
      totalRestaurants,
      totalAdmins,
      totalStaff,
      totalTables,
      todayOrders,
      totalRevenue,
      activeRestaurants,
      recentAdmins,
    ] = await Promise.all([
      Restaurant.countDocuments({ is_active: true }),
      User.countDocuments({ role: "admin", is_active: true }),
      User.countDocuments({
        role: { $in: ["manager", "kitchen_staff", "waiter", "delivery_boy"] },
        is_active: true,
      }),
      Table.countDocuments({ is_active: true }),
      Order.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow },
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$total_amount" } } },
      ]),
      Restaurant.countDocuments({
        is_active: true,
        updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Active in last 24 hours
      }),
      User.find({ role: "admin", is_active: true })
        .populate("restaurant_id", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email restaurant_id createdAt last_login"),
    ]);

    // Restaurant-wise statistics
    const restaurantStats = await Restaurant.aggregate([
      { $match: { is_active: true } },
      {
        $lookup: {
          from: "tables",
          localField: "_id",
          foreignField: "restaurant_id",
          as: "tables",
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "restaurant_id",
          as: "orders",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "restaurant_id",
          as: "staff",
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          phone: 1,
          email: 1,
          totalTables: { $size: "$tables" },
          totalOrders: { $size: "$orders" },
          totalStaff: {
            $size: {
              $filter: {
                input: "$staff",
                cond: {
                  $and: [
                    { $eq: ["$$this.is_active", true] },
                    { $ne: ["$$this.role", "customer"] },
                  ],
                },
              },
            },
          },
          todayOrders: {
            $size: {
              $filter: {
                input: "$orders",
                cond: {
                  $gte: ["$$this.createdAt", today],
                },
              },
            },
          },
        },
      },
      { $sort: { todayOrders: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalRestaurants,
          totalAdmins,
          totalStaff,
          totalTables,
          todayOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          activeRestaurants,
        },
        restaurantStats,
        recentAdmins,
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

// Get all admin users
router.get("/admins", requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let filter = { role: "admin", is_active: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const admins = await User.find(filter)
      .populate("restaurant_id", "name address phone")
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        admins,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
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

// Create new admin user
router.post(
  "/admins",
  requireSuperAdmin,
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Valid email required"),
    body("phone").isMobilePhone().withMessage("Valid phone number required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("restaurant_id")
      .isMongoId()
      .withMessage("Valid restaurant ID required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { name, email, phone, password, restaurant_id } = req.body;

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

      // Check if restaurant exists
      const restaurant = await Restaurant.findById(restaurant_id);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      // Check if restaurant already has an admin
      const existingAdmin = await User.findOne({
        restaurant_id,
        role: "admin",
        is_active: true,
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Restaurant already has an admin",
        });
      }

      // Create admin user
      const admin = new User({
        name,
        email,
        phone,
        password,
        role: "admin",
        restaurant_id,
        created_by: req.user._id,
        permissions: [
          "manage_restaurant",
          "manage_menu",
          "manage_tables",
          "manage_orders",
          "manage_staff",
          "view_analytics",
        ],
      });

      await admin.save();

      // Remove password from response
      const adminResponse = admin.toObject();
      delete adminResponse.password;

      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        data: { admin: adminResponse },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
);

// Update admin user
router.put("/admins/:adminId", requireSuperAdmin, async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, phone, is_active } = req.body;

    const admin = await User.findOne({
      _id: adminId,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;
    if (typeof is_active === "boolean") admin.is_active = is_active;

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      success: true,
      message: "Admin updated successfully",
      data: { admin: adminResponse },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get restaurant details with analytics
router.get(
  "/restaurants/:restaurantId/details",
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { restaurantId } = req.params;

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      // Get restaurant analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [
        totalTables,
        activeTables,
        totalStaff,
        todayOrders,
        totalOrders,
        todayRevenue,
        totalRevenue,
        adminUser,
      ] = await Promise.all([
        Table.countDocuments({ restaurant_id: restaurantId, is_active: true }),
        Table.countDocuments({
          restaurant_id: restaurantId,
          status: "occupied",
        }),
        User.countDocuments({
          restaurant_id: restaurantId,
          role: { $in: ["manager", "kitchen_staff", "waiter", "delivery_boy"] },
          is_active: true,
        }),
        Order.countDocuments({
          restaurant_id: restaurantId,
          createdAt: { $gte: today, $lt: tomorrow },
        }),
        Order.countDocuments({ restaurant_id: restaurantId }),
        Order.aggregate([
          {
            $match: {
              restaurant_id: restaurant._id,
              createdAt: { $gte: today, $lt: tomorrow },
              status: "completed",
            },
          },
          { $group: { _id: null, total: { $sum: "$total_amount" } } },
        ]),
        Order.aggregate([
          {
            $match: {
              restaurant_id: restaurant._id,
              status: "completed",
            },
          },
          { $group: { _id: null, total: { $sum: "$total_amount" } } },
        ]),
        User.findOne({ restaurant_id: restaurantId, role: "admin" }).select(
          "name email phone last_login createdAt",
        ),
      ]);

      res.json({
        success: true,
        data: {
          restaurant,
          admin: adminUser,
          analytics: {
            totalTables,
            activeTables,
            totalStaff,
            todayOrders,
            totalOrders,
            todayRevenue: todayRevenue[0]?.total || 0,
            totalRevenue: totalRevenue[0]?.total || 0,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
);

// Get all restaurants for super admin
router.get("/restaurants", requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let filter = { is_active: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Restaurant.countDocuments(filter);

    // Get additional info for each restaurant
    const restaurantsWithInfo = await Promise.all(
      restaurants.map(async (restaurant) => {
        const [tablesCount, staffCount, ordersCount, admin] = await Promise.all(
          [
            Table.countDocuments({
              restaurant_id: restaurant._id,
              is_active: true,
            }),
            User.countDocuments({
              restaurant_id: restaurant._id,
              role: { $ne: "customer" },
              is_active: true,
            }),
            Order.countDocuments({ restaurant_id: restaurant._id }),
            User.findOne({
              restaurant_id: restaurant._id,
              role: "admin",
            }).select("name email"),
          ],
        );

        return {
          ...restaurant.toObject(),
          tablesCount,
          staffCount,
          ordersCount,
          admin,
        };
      }),
    );

    res.json({
      success: true,
      data: {
        restaurants: restaurantsWithInfo,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
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

// Analytics endpoint for super admin
router.get("/analytics", requireSuperAdmin, async (req, res) => {
  try {
    const { period = "week" } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "today":
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          },
        };
        break;
      case "week":
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter = { createdAt: { $gte: weekStart } };
        break;
      case "month":
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        };
        break;
    }

    // Revenue by restaurant
    const revenueByRestaurant = await Order.aggregate([
      { $match: { ...dateFilter, status: "completed" } },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurant_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
      {
        $group: {
          _id: "$restaurant_id",
          restaurantName: { $first: "$restaurant.name" },
          totalRevenue: { $sum: "$total_amount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    // Daily analytics for the period
    const dailyAnalytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$total_amount", 0],
            },
          },
          avgOrderValue: {
            $avg: {
              $cond: [{ $eq: ["$status", "completed"] }, "$total_amount", null],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        revenueByRestaurant,
        dailyAnalytics,
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

export default router;
