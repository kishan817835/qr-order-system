import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Filter,
  Eye,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

// For now, using mock data - you can connect to API later
const mockStats = {
  overview: {
    totalRestaurants: 12,
    totalAdmins: 12,
    totalStaff: 145,
    totalTables: 350,
    todayOrders: 48,
    totalRevenue: 15650,
    activeRestaurants: 8,
  },
  restaurantStats: [
    {
      _id: "1",
      name: "Spice Garden",
      address: "123 Main Street, Food District",
      totalTables: 15,
      totalOrders: 1250,
      totalStaff: 12,
      todayOrders: 8,
    },
    {
      _id: "2",
      name: "Ocean View",
      address: "456 Beach Road, Coastal Area",
      totalTables: 20,
      totalOrders: 980,
      totalStaff: 15,
      todayOrders: 12,
    },
  ],
  recentAdmins: [
    {
      _id: "1",
      name: "John Doe",
      email: "john@restaurant.com",
      restaurant_id: { name: "Spice Garden" },
      createdAt: "2024-01-15",
      last_login: "2024-01-20",
    },
  ],
};

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);

  // Mock loading effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-orange mx-auto mb-4 animate-pulse" />
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { overview, restaurantStats, recentAdmins } = stats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage all restaurants and administrators
              </p>
            </div>
            <div className="flex space-x-3">
              <Link to="/super-admin/analytics" className="btn btn-secondary">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
              <Link to="/super-admin/create-admin" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Restaurants</p>
                <p className="text-2xl font-bold text-primary">
                  {overview.totalRestaurants}
                </p>
                <p className="text-sm text-green-600">
                  {overview.activeRestaurants} active today
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-primary">
                  {overview.totalAdmins}
                </p>
                <p className="text-sm text-orange-600">Restaurant managers</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-primary">
                  {overview.totalStaff}
                </p>
                <p className="text-sm text-gray-600">Across all restaurants</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-primary">
                  {overview.todayOrders}
                </p>
                <p className="text-sm text-green-600">
                  ₹{overview.totalRevenue.toLocaleString()} revenue
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Restaurants */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Restaurants
              </h2>
              <Link
                to="/super-admin/restaurants"
                className="text-sm text-orange-600 font-medium hover:text-orange-700"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {restaurantStats.slice(0, 5).map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {restaurant.address}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{restaurant.totalTables} tables</span>
                      <span>{restaurant.totalStaff} staff</span>
                      <span>{restaurant.totalOrders} total orders</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {restaurant.todayOrders}
                    </p>
                    <p className="text-xs text-gray-500">Today's orders</p>
                  </div>
                  <div className="ml-4 text-orange-600 hover:text-orange-700">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Admins */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Admins
              </h2>
              <Link
                to="/super-admin/admins"
                className="text-sm text-orange-600 font-medium hover:text-orange-700"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {admin.name}
                      </h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <p className="text-xs text-gray-500">
                        {admin.restaurant_id?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>
                      Created: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                    {admin.last_login && (
                      <p>
                        Last login:{" "}
                        {new Date(admin.last_login).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/super-admin/create-admin"
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Create New Admin
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add restaurant administrator
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/super-admin/restaurants"
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Manage Restaurants
                  </h3>
                  <p className="text-sm text-gray-600">View all restaurants</p>
                </div>
              </div>
            </Link>

            <Link
              to="/super-admin/analytics"
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Platform insights</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
