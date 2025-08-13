// In-memory database when MongoDB is not available
let mockData = {
  users: [
    {
      _id: "super_admin_1",
      name: "Super Admin",
      email: "superadmin@spicegarden.com",
      phone: "9876543210",
      password: "$2a$10$8K1p/a0drtIzdeqI5Sp.NeYRDY2QeDp6j8gE1P9DxQ7J.5fJRGzfm", // super123
      role: "super_admin",
      is_verified: true,
      created_at: new Date(),
      last_login: new Date(),
    },
    {
      _id: "admin_1",
      name: "Restaurant Admin",
      email: "admin@spicegarden.com",
      phone: "9876543201",
      password: "$2a$10$rR7/VXQ5lPaP3rO6tL.RPeJ2p8tJt3LKWMHs8xTw9Pq4I5O6Nf7Le", // admin123
      role: "admin",
      restaurant_id: "restaurant_1",
      is_verified: true,
      created_at: new Date(),
      last_login: new Date(),
    },
    {
      _id: "kitchen_1",
      name: "Kitchen Staff",
      email: "kitchen@spicegarden.com",
      phone: "9876543202",
      password: "$2a$10$mH9FxO8zG4P3nN5jL.QfJe7yT2lK8vXc9P1qE6rI0oN3wZ4pL7mQ", // kitchen123
      role: "kitchen_staff",
      restaurant_id: "restaurant_1",
      is_verified: true,
      created_at: new Date(),
      last_login: new Date(),
    },
    {
      _id: "delivery_1",
      name: "Delivery Boy",
      email: "delivery@spicegarden.com",
      phone: "9876543203",
      password: "$2a$10$nJ8GxN9zA5Q4oO6kM.RgKf8zU3mL9wYd0Q2rF7sJ1pO4xA5qM8nR", // delivery123
      role: "delivery_boy",
      restaurant_id: "restaurant_1",
      is_verified: true,
      created_at: new Date(),
      last_login: new Date(),
    },
    {
      _id: "waiter_1",
      name: "Waiter",
      email: "waiter@spicegarden.com",
      phone: "9876543204",
      password: "$2a$10$oK9HyO0aB6R5pP7lN.ShLg9aV4nM0xZe1R3sG8tK2qP5yB6rN9oS", // waiter123
      role: "waiter",
      restaurant_id: "restaurant_1",
      is_verified: true,
      created_at: new Date(),
      last_login: new Date(),
    },
  ],
  restaurants: [
    {
      _id: "restaurant_1",
      name: "Spice Garden",
      address: "123 Main Street, Food District",
      phone: "9876543200",
      email: "info@spicegarden.com",
      logo_url:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop&crop=center",
      banner_url:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop",
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
      created_at: new Date(),
    },
  ],
  categories: [
    {
      _id: "category_1",
      name: "Starters",
      description: "Delicious appetizers to start your meal",
      restaurant_id: "restaurant_1",
      is_active: true,
      sort_order: 1,
      created_at: new Date(),
    },
    {
      _id: "category_2",
      name: "Main Course",
      description: "Hearty main dishes",
      restaurant_id: "restaurant_1",
      is_active: true,
      sort_order: 2,
      created_at: new Date(),
    },
    {
      _id: "category_3",
      name: "Desserts",
      description: "Sweet treats to end your meal",
      restaurant_id: "restaurant_1",
      is_active: true,
      sort_order: 3,
      created_at: new Date(),
    },
    {
      _id: "category_4",
      name: "Beverages",
      description: "Refreshing drinks",
      restaurant_id: "restaurant_1",
      is_active: true,
      sort_order: 4,
      created_at: new Date(),
    },
  ],
  menuItems: [
    {
      _id: "item_1",
      name: "Crispy Paneer Tikka",
      description: "Marinated cottage cheese grilled to perfection with spices",
      price: 220,
      category_id: "category_1",
      restaurant_id: "restaurant_1",
      image_url:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
      is_veg: true,
      is_available: true,
      preparation_time: 15,
      spice_level: "medium",
      isPriority: true,
      created_at: new Date(),
    },
    {
      _id: "item_2",
      name: "Chicken Wings",
      description: "Spicy chicken wings with tangy sauce",
      price: 280,
      category_id: "category_1",
      restaurant_id: "restaurant_1",
      image_url:
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop",
      is_veg: false,
      is_available: true,
      preparation_time: 20,
      spice_level: "high",
      created_at: new Date(),
    },
    {
      _id: "item_3",
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken pieces",
      price: 320,
      category_id: "category_2",
      restaurant_id: "restaurant_1",
      image_url:
        "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
      is_veg: false,
      is_available: true,
      preparation_time: 25,
      spice_level: "medium",
      isPriority: true,
      created_at: new Date(),
    },
    {
      _id: "item_4",
      name: "Paneer Makhani",
      description: "Rich and creamy cottage cheese curry",
      price: 280,
      category_id: "category_2",
      restaurant_id: "restaurant_1",
      image_url:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
      is_veg: true,
      is_available: true,
      preparation_time: 20,
      spice_level: "medium",
      created_at: new Date(),
    },
    {
      _id: "item_5",
      name: "Gulab Jamun",
      description: "Traditional Indian sweet dumplings in sugar syrup",
      price: 120,
      category_id: "category_3",
      restaurant_id: "restaurant_1",
      image_url:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      is_veg: true,
      is_available: true,
      preparation_time: 5,
      spice_level: "none",
      created_at: new Date(),
    },
    {
      _id: "item_6",
      name: "Masala Chai",
      description: "Traditional Indian spiced tea",
      price: 50,
      category_id: "category_4",
      restaurant_id: "restaurant_1",
      image_url:
        "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop",
      is_veg: true,
      is_available: true,
      preparation_time: 5,
      spice_level: "low",
      created_at: new Date(),
    },
  ],
  tables: [],
  orders: [],
};

// Helper functions to simulate database operations
export const findUser = (query) => {
  if (query.email) {
    return mockData.users.find((user) => user.email === query.email);
  }
  if (query._id) {
    return mockData.users.find((user) => user._id === query._id);
  }
  return null;
};

export const findRestaurant = (id) => {
  return mockData.restaurants.find((restaurant) => restaurant._id === id);
};

export const findCategories = (restaurantId) => {
  return mockData.categories.filter(
    (category) => category.restaurant_id === restaurantId,
  );
};

export const findMenuItems = (restaurantId) => {
  return mockData.menuItems.filter(
    (item) => item.restaurant_id === restaurantId,
  );
};

export const findMenuItemsByCategory = (categoryId) => {
  return mockData.menuItems.filter((item) => item.category_id === categoryId);
};

export const getDashboardStats = (restaurantId) => {
  return {
    totalOrders: 24,
    revenue: 12450,
    activeTables: 8,
    avgOrderValue: 520,
  };
};

export const getOrders = (restaurantId, options = {}) => {
  // Return mock orders
  return [
    {
      _id: "order_1",
      order_number: "ORD-1001",
      table_number: "5",
      service_type: "dining",
      items: mockData.menuItems.slice(0, 3),
      total_amount: 850,
      status: "preparing",
      restaurant_id: restaurantId,
      created_at: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      _id: "order_2",
      order_number: "ORD-1002",
      service_type: "takeaway",
      items: mockData.menuItems.slice(3, 5),
      total_amount: 420,
      status: "ready",
      restaurant_id: restaurantId,
      created_at: new Date(Date.now() - 15 * 60 * 1000),
    },
  ];
};

export default mockData;
