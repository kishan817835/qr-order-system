import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Import models
import User from "./src/models/User.js";
import Restaurant from "./src/models/Restaurant.js";
import Category from "./src/models/Category.js";
import MenuItem from "./src/models/MenuItem.js";
import Table from "./src/models/Table.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant_management";

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create Super Admin
    const superAdminPassword = await bcrypt.hash("super123", 10);
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@spicegarden.com",
      phone: "9876543210",
      password: superAdminPassword,
      role: "super_admin",
      is_verified: true,
    });
    console.log("👑 Created Super Admin");

    // Create Restaurant
    const restaurant = await Restaurant.create({
      name: "Spice Garden",
      address: "123 Main Street, Food District",
      phone: "9876543201",
      email: "admin@spicegarden.com",
      opening_hours: {
        monday: { open: "09:00", close: "22:00", is_open: true },
        tuesday: { open: "09:00", close: "22:00", is_open: true },
        wednesday: { open: "09:00", close: "22:00", is_open: true },
        thursday: { open: "09:00", close: "22:00", is_open: true },
        friday: { open: "09:00", close: "22:00", is_open: true },
        saturday: { open: "09:00", close: "23:00", is_open: true },
        sunday: { open: "10:00", close: "22:00", is_open: true },
      },
      status: "active",
    });
    console.log("🏪 Created Restaurant");

    // Create Restaurant Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Restaurant Admin",
      email: "admin@spicegarden.com",
      phone: "9876543202",
      password: adminPassword,
      role: "admin",
      restaurant_id: restaurant._id,
      is_verified: true,
    });
    console.log("👨‍💼 Created Restaurant Admin");

    // Create Staff Users
    const kitchenPassword = await bcrypt.hash("kitchen123", 10);
    const kitchen = await User.create({
      name: "Kitchen Staff",
      email: "kitchen@spicegarden.com",
      phone: "9876543203",
      password: kitchenPassword,
      role: "kitchen_staff",
      restaurant_id: restaurant._id,
      is_verified: true,
    });

    const deliveryPassword = await bcrypt.hash("delivery123", 10);
    const delivery = await User.create({
      name: "Delivery Boy",
      email: "delivery@spicegarden.com",
      phone: "9876543204",
      password: deliveryPassword,
      role: "delivery_boy",
      restaurant_id: restaurant._id,
      is_verified: true,
    });

    const waiterPassword = await bcrypt.hash("waiter123", 10);
    const waiter = await User.create({
      name: "Waiter",
      email: "waiter@spicegarden.com",
      phone: "9876543205",
      password: waiterPassword,
      role: "waiter",
      restaurant_id: restaurant._id,
      is_verified: true,
    });
    console.log("👥 Created Staff Users");

    // Create Categories
    const startersCategory = await Category.create({
      name: "Starters",
      description: "Delicious appetizers to start your meal",
      restaurant_id: restaurant._id,
      is_active: true,
      sort_order: 1,
    });

    const mainCourseCategory = await Category.create({
      name: "Main Course",
      description: "Hearty main dishes",
      restaurant_id: restaurant._id,
      is_active: true,
      sort_order: 2,
    });

    const desertsCategory = await Category.create({
      name: "Desserts",
      description: "Sweet treats to end your meal",
      restaurant_id: restaurant._id,
      is_active: true,
      sort_order: 3,
    });

    const beveragesCategory = await Category.create({
      name: "Beverages",
      description: "Refreshing drinks",
      restaurant_id: restaurant._id,
      is_active: true,
      sort_order: 4,
    });
    console.log("📂 Created Categories");

    // Create Menu Items
    const menuItems = [
      // Starters
      {
        name: "Crispy Paneer Tikka",
        description: "Marinated cottage cheese grilled to perfection with spices",
        price: 220,
        category_id: startersCategory._id,
        restaurant_id: restaurant._id,
        image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
        is_veg: true,
        is_available: true,
        preparation_time: 15,
        spice_level: "medium",
      },
      {
        name: "Chicken Wings",
        description: "Spicy chicken wings with tangy sauce",
        price: 280,
        category_id: startersCategory._id,
        restaurant_id: restaurant._id,
        image_url: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop",
        is_veg: false,
        is_available: true,
        preparation_time: 20,
        spice_level: "high",
      },
      // Main Course
      {
        name: "Butter Chicken",
        description: "Creamy tomato-based curry with tender chicken pieces",
        price: 320,
        category_id: mainCourseCategory._id,
        restaurant_id: restaurant._id,
        image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
        is_veg: false,
        is_available: true,
        preparation_time: 25,
        spice_level: "medium",
      },
      {
        name: "Paneer Makhani",
        description: "Rich and creamy cottage cheese curry",
        price: 280,
        category_id: mainCourseCategory._id,
        restaurant_id: restaurant._id,
        image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
        is_veg: true,
        is_available: true,
        preparation_time: 20,
        spice_level: "medium",
      },
      // Desserts
      {
        name: "Gulab Jamun",
        description: "Traditional Indian sweet dumplings in sugar syrup",
        price: 120,
        category_id: desertsCategory._id,
        restaurant_id: restaurant._id,
        image_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        is_veg: true,
        is_available: true,
        preparation_time: 5,
        spice_level: "none",
      },
      // Beverages
      {
        name: "Masala Chai",
        description: "Traditional Indian spiced tea",
        price: 50,
        category_id: beveragesCategory._id,
        restaurant_id: restaurant._id,
        image_url: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop",
        is_veg: true,
        is_available: true,
        preparation_time: 5,
        spice_level: "low",
      },
    ];

    await MenuItem.insertMany(menuItems);
    console.log("🍽️  Created Menu Items");

    // Create Tables
    const tables = [];
    for (let i = 1; i <= 15; i++) {
      tables.push({
        table_number: i.toString(),
        capacity: i <= 5 ? 2 : i <= 10 ? 4 : 6,
        restaurant_id: restaurant._id,
        status: "available",
        location: "main-hall",
      });
    }
    await Table.insertMany(tables);
    console.log("🪑 Created Tables");

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("Super Admin: superadmin@spicegarden.com / super123");
    console.log("Admin: admin@spicegarden.com / admin123");
    console.log("Kitchen: kitchen@spicegarden.com / kitchen123");
    console.log("Delivery: delivery@spicegarden.com / delivery123");
    console.log("Waiter: waiter@spicegarden.com / waiter123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
};

seedData();
