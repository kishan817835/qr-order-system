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
