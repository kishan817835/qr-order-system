import express from "express";
import { body, validationResult } from "express-validator";
import Restaurant from "../models/Restaurant.js";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import ExtraCharge from "../models/ExtraCharge.js";

const router = express.Router();

// Get restaurant by ID
router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      data: { restaurant },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get restaurant with full menu data
router.get("/:restaurantId/menu", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Get restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Get categories with menu items
    const categories = await Category.find({
      restaurant_id: restaurantId,
      is_active: true,
    }).sort({ sort_order: 1, name: 1 });

    const categoriesWithItems = await Promise.all(
      categories.map(async (category) => {
        const items = await MenuItem.find({
          restaurant_id: restaurantId,
          category_id: category._id,
          is_active: true,
          availability: { $ne: "discontinued" },
        }).sort({ sort_order: 1, name: 1 });

        return {
          id: category._id,
          name: category.name,
          description: category.description,
          image_url: category.image_url,
          items: items.map((item) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url,
            category_id: item.category_id,
            discount: item.discount,
            isPriority: item.is_priority,
            isVegetarian: item.is_vegetarian,
            isVegan: item.is_vegan,
            spiceLevel: item.spice_level,
            preparationTime: item.preparation_time,
            availability: item.availability,
            tags: item.tags,
          })),
        };
      }),
    );

    // Get priority items
    const priorityItems = await MenuItem.find({
      restaurant_id: restaurantId,
      is_priority: true,
      is_active: true,
      availability: "available",
    })
      .limit(10)
      .sort({ sort_order: 1 });

    // Get extra charges
    const extraCharges = await ExtraCharge.find({
      restaurant_id: restaurantId,
      is_active: true,
    });

    res.json({
      success: true,
      data: {
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          logo_url: restaurant.logo_url,
          banner_url: restaurant.banner_url,
          address: restaurant.address,
        },
        categories: categoriesWithItems,
        priorityItems: priorityItems.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          category_id: item.category_id,
          discount: item.discount,
          isPriority: item.is_priority,
        })),
        extraCharges: extraCharges.map((charge) => ({
          id: charge._id,
          name: charge.name,
          amount: charge.amount,
          type: charge.type,
        })),
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

// Create restaurant
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Restaurant name is required"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("phone").isMobilePhone().withMessage("Valid phone number required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("owner_id").isMongoId().withMessage("Valid owner ID required"),
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

      const restaurant = new Restaurant(req.body);
      await restaurant.save();

      res.status(201).json({
        success: true,
        message: "Restaurant created successfully",
        data: { restaurant },
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Restaurant with this email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
);

// Update restaurant
router.put("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      data: { restaurant },
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
