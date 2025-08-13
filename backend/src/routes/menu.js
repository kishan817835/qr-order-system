import express from "express";
import { body, validationResult } from "express-validator";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import { findCategories, findMenuItems, findMenuItemsByCategory } from "../data/mockDatabase.js";

const router = express.Router();

// CATEGORY ROUTES

// Get all categories for a restaurant
router.get("/categories/restaurant/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const categories = await Category.find({
      restaurant_id: restaurantId,
      is_active: true,
    }).sort({ sort_order: 1, name: 1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Create category
router.post(
  "/categories",
  [
    body("restaurant_id")
      .isMongoId()
      .withMessage("Valid restaurant ID required"),
    body("name").trim().notEmpty().withMessage("Category name is required"),
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

      const category = new Category(req.body);
      await category.save();

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: { category },
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists in the restaurant",
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

// Update category
router.put("/categories/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndUpdate(categoryId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete category
router.delete("/categories/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category has menu items
    const itemCount = await MenuItem.countDocuments({
      category_id: categoryId,
      is_active: true,
    });

    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category that contains menu items",
      });
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { is_active: false },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// MENU ITEM ROUTES

// Get all menu items for a category
router.get("/items/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    const items = await MenuItem.find({
      category_id: categoryId,
      is_active: true,
    }).sort({ sort_order: 1, name: 1 });

    res.json({
      success: true,
      data: { items },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get all menu items for a restaurant
router.get("/items/restaurant/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const items = await MenuItem.find({
      restaurant_id: restaurantId,
      is_active: true,
    })
      .populate("category_id")
      .sort({ category_id: 1, sort_order: 1, name: 1 });

    res.json({
      success: true,
      data: { items },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get single menu item
router.get("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await MenuItem.findById(itemId).populate("category_id");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      data: { item },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Create menu item
router.post(
  "/items",
  [
    body("restaurant_id")
      .isMongoId()
      .withMessage("Valid restaurant ID required"),
    body("category_id").isMongoId().withMessage("Valid category ID required"),
    body("name").trim().notEmpty().withMessage("Item name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Valid price required"),
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

      const item = new MenuItem(req.body);
      await item.save();

      const populatedItem = await MenuItem.findById(item._id).populate(
        "category_id",
      );

      res.status(201).json({
        success: true,
        message: "Menu item created successfully",
        data: { item: populatedItem },
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

// Update menu item
router.put("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await MenuItem.findByIdAndUpdate(itemId, req.body, {
      new: true,
      runValidators: true,
    }).populate("category_id");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
      data: { item },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Update item availability
router.patch(
  "/items/:itemId/availability",
  [
    body("availability")
      .isIn(["available", "out_of_stock", "discontinued"])
      .withMessage("Invalid availability status"),
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

      const { itemId } = req.params;
      const { availability } = req.body;

      const item = await MenuItem.findByIdAndUpdate(
        itemId,
        { availability },
        { new: true },
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found",
        });
      }

      res.json({
        success: true,
        message: "Item availability updated successfully",
        data: { item },
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

// Delete menu item
router.delete("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await MenuItem.findByIdAndUpdate(
      itemId,
      { is_active: false },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
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
