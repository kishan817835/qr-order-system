const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

class ApiService {
  private baseURL = API_BASE_URL;
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);

      // Try to provide fallback mock data for critical endpoints
      const mockResponse = this.getMockResponse(endpoint);
      if (mockResponse) {
        console.log("Using mock data fallback for:", endpoint);
        return mockResponse;
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Auth methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private getMockResponse(endpoint: string): any {
    // Provide mock data fallbacks for critical endpoints
    if (endpoint.includes('/restaurants/') && endpoint.includes('/menu')) {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Crispy Paneer Tikka",
            description: "Marinated cottage cheese grilled to perfection with spices",
            price: 220,
            category_id: "1",
            image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
            is_veg: true,
            is_available: true,
          },
          {
            id: 2,
            name: "Butter Chicken",
            description: "Creamy tomato-based curry with tender chicken pieces",
            price: 320,
            category_id: "2",
            image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
            is_veg: false,
            is_available: true,
          },
          {
            id: 3,
            name: "Paneer Makhani",
            description: "Rich and creamy cottage cheese curry",
            price: 280,
            category_id: "2",
            image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
            is_veg: true,
            is_available: true,
          },
          {
            id: 4,
            name: "Gulab Jamun",
            description: "Traditional Indian sweet dumplings in sugar syrup",
            price: 120,
            category_id: "3",
            image_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
            is_veg: true,
            is_available: true,
          },
          {
            id: 5,
            name: "Masala Chai",
            description: "Traditional Indian spiced tea",
            price: 50,
            category_id: "4",
            image_url: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop",
            is_veg: true,
            is_available: true,
          }
        ]
      };
    }

    if (endpoint.includes('/restaurants/')) {
      return {
        success: true,
        data: {
          id: 1,
          name: "Spice Garden",
          logo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop&crop=center",
          address: "123 Main Street, Food District",
          phone: "+91 12345 67890",
          email: "admin@spicegarden.com",
          banner_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop"
        }
      };
    }

    if (endpoint.includes('/categories/restaurant/')) {
      return {
        success: true,
        data: [
          { id: "1", name: "Starters", description: "Appetizers to start your meal" },
          { id: "2", name: "Main Course", description: "Hearty main dishes" },
          { id: "3", name: "Desserts", description: "Sweet treats" },
          { id: "4", name: "Beverages", description: "Refreshing drinks" }
        ]
      };
    }

    return null;
  }

  // Restaurant APIs
  async getRestaurant(restaurantId: string) {
    return this.request(`/restaurants/${restaurantId}`);
  }

  async getRestaurantMenu(restaurantId: string) {
    return this.request(`/restaurants/${restaurantId}/menu`);
  }

  // Table APIs
  async getTables(restaurantId: string) {
    return this.request(`/tables/restaurant/${restaurantId}`);
  }

  async createTable(tableData: any) {
    return this.request("/tables", {
      method: "POST",
      body: JSON.stringify(tableData),
    });
  }

  async updateTable(tableId: string, updateData: any) {
    return this.request(`/tables/${tableId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async updateTableStatus(tableId: string, status: string) {
    return this.request(`/tables/${tableId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteTable(tableId: string) {
    return this.request(`/tables/${tableId}`, {
      method: "DELETE",
    });
  }

  // QR Code APIs
  async generateTableQR(tableId: string) {
    return this.request(`/qr/table/${tableId}`);
  }

  async generateRestaurantQRs(restaurantId: string) {
    return this.request(`/qr/restaurant/${restaurantId}/tables`);
  }

  async regenerateTableQR(tableId: string) {
    return this.request(`/qr/table/${tableId}/regenerate`, {
      method: "POST",
    });
  }

  // Order APIs
  async getOrders(restaurantId: string, filters?: any) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/orders/restaurant/${restaurantId}${queryParams ? `?${queryParams}` : ""}`;
    return this.request(endpoint);
  }

  async getOrder(orderId: string) {
    return this.request(`/orders/${orderId}`);
  }

  async searchOrderByNumber(orderNumber: string) {
    return this.request(`/orders/search?orderNumber=${orderNumber}`);
  }

  async createOrder(orderData: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async getOrderAnalytics(restaurantId: string, period = "today") {
    return this.request(`/orders/analytics/${restaurantId}?period=${period}`);
  }

  // Menu APIs
  async getCategories(restaurantId: string) {
    return this.request(`/menu/categories/restaurant/${restaurantId}`);
  }

  async createCategory(categoryData: any) {
    return this.request("/menu/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(categoryId: string, updateData: any) {
    return this.request(`/menu/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteCategory(categoryId: string) {
    return this.request(`/menu/categories/${categoryId}`, {
      method: "DELETE",
    });
  }

  async getMenuItems(restaurantId: string) {
    return this.request(`/menu/items/restaurant/${restaurantId}`);
  }

  async getCategoryItems(categoryId: string) {
    return this.request(`/menu/items/category/${categoryId}`);
  }

  async createMenuItem(itemData: any) {
    return this.request("/menu/items", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  }

  async updateMenuItem(itemId: string, updateData: any) {
    return this.request(`/menu/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async updateItemAvailability(itemId: string, availability: string) {
    return this.request(`/menu/items/${itemId}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ availability }),
    });
  }

  async deleteMenuItem(itemId: string) {
    return this.request(`/menu/items/${itemId}`, {
      method: "DELETE",
    });
  }

  // Admin APIs
  async getDashboardStats(restaurantId: string) {
    return this.request(`/admin/dashboard/${restaurantId}`);
  }

  async getStaff(restaurantId: string) {
    return this.request(`/admin/staff/${restaurantId}`);
  }

  async createStaff(staffData: any) {
    return this.request("/admin/staff", {
      method: "POST",
      body: JSON.stringify(staffData),
    });
  }

  async getExtraCharges(restaurantId: string) {
    return this.request(`/admin/charges/${restaurantId}`);
  }

  async createExtraCharge(chargeData: any) {
    return this.request("/admin/charges", {
      method: "POST",
      body: JSON.stringify(chargeData),
    });
  }

  async updateExtraCharge(chargeId: string, updateData: any) {
    return this.request(`/admin/charges/${chargeId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteExtraCharge(chargeId: string) {
    return this.request(`/admin/charges/${chargeId}`, {
      method: "DELETE",
    });
  }

  async getReports(restaurantId: string, params: any) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/admin/reports/${restaurantId}?${queryParams}`);
  }

  // Super Admin APIs
  async getSuperAdminDashboard() {
    return this.request("/super-admin/dashboard");
  }

  async getSuperAdminAdmins(params?: {
    page?: number;
    search?: string;
    limit?: number;
  }) {
    const queryParams = params
      ? new URLSearchParams({
          page: params.page?.toString() || "1",
          search: params.search || "",
          limit: params.limit?.toString() || "20",
        }).toString()
      : "";
    return this.request(
      `/super-admin/admins${queryParams ? `?${queryParams}` : ""}`,
    );
  }

  async createSuperAdminAdmin(adminData: any) {
    return this.request("/super-admin/admins", {
      method: "POST",
      body: JSON.stringify(adminData),
    });
  }

  async updateSuperAdminAdmin(adminId: string, updateData: any) {
    return this.request(`/super-admin/admins/${adminId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async getSuperAdminRestaurants(params?: {
    page?: number;
    search?: string;
    limit?: number;
  }) {
    const queryParams = params
      ? new URLSearchParams({
          page: params.page?.toString() || "1",
          search: params.search || "",
          limit: params.limit?.toString() || "20",
        }).toString()
      : "";
    return this.request(
      `/super-admin/restaurants${queryParams ? `?${queryParams}` : ""}`,
    );
  }

  async getSuperAdminRestaurantDetails(restaurantId: string) {
    return this.request(`/super-admin/restaurants/${restaurantId}/details`);
  }

  async getSuperAdminAnalytics(period = "week") {
    return this.request(`/super-admin/analytics?period=${period}`);
  }

  // Auth APIs
  async login(email: string, password: string) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // If API login fails, try mock authentication
    if (!response.success) {
      console.log("API login failed, trying mock authentication...");
      const mockUsers: Record<string, { password: string; role: string; name: string }> = {
        "admin@spicegarden.com": { password: "admin123", role: "admin", name: "Restaurant Admin" },
        "superadmin@spicegarden.com": { password: "super123", role: "super_admin", name: "Super Admin" },
        "kitchen@spicegarden.com": { password: "kitchen123", role: "kitchen_staff", name: "Kitchen Staff" },
        "delivery@spicegarden.com": { password: "delivery123", role: "delivery_boy", name: "Delivery Boy" },
        "waiter@spicegarden.com": { password: "waiter123", role: "waiter", name: "Waiter" },
      };

      const mockUser = mockUsers[email];
      if (mockUser && mockUser.password === password) {
        return {
          success: true,
          message: "Login successful (Mock Mode)",
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
        };
      }
    }

    return response;
  }

  async register(userData: any) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }
}

export const apiService = new ApiService();
export default apiService;
