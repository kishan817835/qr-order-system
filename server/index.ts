import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      mode: "mock",
    });
  });

  // Mock authentication endpoint
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    // Mock users for demo
    const mockUsers = {
      "admin@spicegarden.com": {
        password: "admin123",
        role: "admin",
        name: "Restaurant Admin",
      },
      "superadmin@spicegarden.com": {
        password: "super123",
        role: "super_admin",
        name: "Super Admin",
      },
      "kitchen@spicegarden.com": {
        password: "kitchen123",
        role: "kitchen_staff",
        name: "Kitchen Staff",
      },
      "delivery@spicegarden.com": {
        password: "delivery123",
        role: "delivery_boy",
        name: "Delivery Boy",
      },
      "waiter@spicegarden.com": {
        password: "waiter123",
        role: "waiter",
        name: "Waiter",
      },
    };

    const mockUser = mockUsers[email as keyof typeof mockUsers];
    if (!mockUser || mockUser.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.json({
      success: true,
      message: "Login successful (Demo Mode)",
      data: {
        user: {
          id: "mock_user_id",
          name: mockUser.name,
          email: email,
          role: mockUser.role,
          restaurant_id: "1",
        },
        token: "mock_jwt_token",
      },
    });
  });

  // Mock restaurant data endpoint
  app.get("/api/restaurants/:id", (_req, res) => {
    res.json({
      success: true,
      data: {
        id: 1,
        name: "Spice Garden",
        logo_url:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop&crop=center",
        address: "123 Main Street, Food District",
        phone: "+91 12345 67890",
        email: "admin@spicegarden.com",
      },
    });
  });

  // Mock menu endpoint
  app.get("/api/restaurants/:id/menu", (_req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 1,
          name: "Crispy Paneer Tikka",
          description:
            "Marinated cottage cheese grilled to perfection with spices",
          price: 220,
          category_id: "1",
          image_url:
            "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
          is_veg: true,
          is_available: true,
        },
        {
          id: 2,
          name: "Butter Chicken",
          description: "Creamy tomato-based curry with tender chicken pieces",
          price: 320,
          category_id: "2",
          image_url:
            "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
          is_veg: false,
          is_available: true,
        },
      ],
    });
  });

  // Mock categories endpoint
  app.get("/api/menu/categories/restaurant/:id", (_req, res) => {
    res.json({
      success: true,
      data: [
        { id: "1", name: "Starters", description: "Appetizers" },
        { id: "2", name: "Main Course", description: "Main dishes" },
        { id: "3", name: "Desserts", description: "Sweet treats" },
        { id: "4", name: "Beverages", description: "Drinks" },
      ],
    });
  });

  // Mock dashboard stats
  app.get("/api/admin/dashboard/:id", (_req, res) => {
    res.json({
      success: true,
      data: {
        totalOrders: 24,
        revenue: 12450,
        activeTables: 8,
        avgOrderValue: 520,
      },
    });
  });

  // Mock orders endpoint
  app.get("/api/orders/restaurant/:id", (_req, res) => {
    res.json({
      success: true,
      data: [
        {
          _id: "1234",
          order_number: "ORD-1234",
          table_number: "5",
          service_type: "dining",
          items: [{}, {}, {}],
          total_amount: 850,
          status: "preparing",
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
      ],
    });
  });

  // Original demo routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
