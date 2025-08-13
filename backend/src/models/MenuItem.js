import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image_url: {
      type: String,
      default: "",
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    is_priority: {
      type: Boolean,
      default: false,
    },
    is_vegetarian: {
      type: Boolean,
      default: false,
    },
    is_vegan: {
      type: Boolean,
      default: false,
    },
    spice_level: {
      type: String,
      enum: ["mild", "medium", "hot", "very_hot"],
      default: "medium",
    },
    allergens: [
      {
        type: String,
      },
    ],
    preparation_time: {
      type: Number, // in minutes
      default: 15,
    },
    calories: {
      type: Number,
      default: 0,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    availability: {
      type: String,
      enum: ["available", "out_of_stock", "discontinued"],
      default: "available",
    },
    tags: [
      {
        type: String,
      },
    ],
    sort_order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

menuItemSchema.index({ restaurant_id: 1, category_id: 1 });
menuItemSchema.index({ restaurant_id: 1, is_priority: 1 });
menuItemSchema.index({ restaurant_id: 1, availability: 1 });

export default mongoose.model("MenuItem", menuItemSchema);
