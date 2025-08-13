import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "restaurant_secret", {
    expiresIn: "7d",
  });
};

// Register
router.post(
  "/register",
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

      const {
        name,
        email,
        phone,
        password,
        role = "customer",
        restaurant_id,
      } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email or phone",
        });
      }

      // Create user
      const user = new User({
        name,
        email,
        phone,
        password,
        role,
        restaurant_id: restaurant_id || null,
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            restaurant_id: user.restaurant_id,
          },
          token,
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

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
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

      const { email, password } = req.body;

      // Check if MongoDB is connected
      if (!global.mongoConnected) {
        // Mock authentication for demo purposes when DB is not available
        const mockUsers = {
          "admin@spicegarden.com": { password: "admin123", role: "admin", name: "Restaurant Admin" },
          "superadmin@spicegarden.com": { password: "super123", role: "super_admin", name: "Super Admin" },
          "kitchen@spicegarden.com": { password: "kitchen123", role: "kitchen_staff", name: "Kitchen Staff" },
          "delivery@spicegarden.com": { password: "delivery123", role: "delivery_boy", name: "Delivery Boy" },
          "waiter@spicegarden.com": { password: "waiter123", role: "waiter", name: "Waiter" },
        };

        const mockUser = mockUsers[email];
        if (!mockUser || mockUser.password !== password) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }

        const token = generateToken("mock_user_id");

        return res.json({
          success: true,
          message: "Login successful (Demo Mode - No Database)",
          data: {
            user: {
              id: "mock_user_id",
              name: mockUser.name,
              email: email,
              role: mockUser.role,
              restaurant_id: "1",
            },
            token,
          },
        });
      }

      // Find user
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Update last login
      user.last_login = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            restaurant_id: user.restaurant_id,
          },
          token,
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

// Get user profile
router.get("/profile", async (req, res) => {
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
    const user = await User.findById(decoded.userId).populate("restaurant_id");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          restaurant: user.restaurant_id,
          profile_image: user.profile_image,
          address: user.address,
          email_verified: user.email_verified,
          phone_verified: user.phone_verified,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

export default router;
