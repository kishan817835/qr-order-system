import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Users, 
  UserCircle, 
  ChefHat, 
  Truck,
  Settings,
  Crown
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">SG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Spice Garden</h1>
                <p className="text-sm text-gray-600">Restaurant Management System</p>
              </div>
            </div>
            <Link 
              to="/login" 
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Spice Garden
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete restaurant management solution with menu ordering, 
            kitchen management, delivery tracking, and administration tools.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Customer Menu */}
          <Link 
            to="/menu/1" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Browse Menu
            </h3>
            <p className="text-gray-600">
              View our delicious menu and place your order
            </p>
          </Link>

          {/* Admin Panel */}
          <Link 
            to="/admin" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Admin Dashboard
            </h3>
            <p className="text-gray-600">
              Manage restaurant operations and settings
            </p>
          </Link>

          {/* Kitchen Dashboard */}
          <Link 
            to="/kitchen" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
              <ChefHat className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Kitchen Dashboard
            </h3>
            <p className="text-gray-600">
              Manage orders and kitchen operations
            </p>
          </Link>

          {/* Delivery Dashboard */}
          <Link 
            to="/delivery" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Delivery Dashboard
            </h3>
            <p className="text-gray-600">
              Track deliveries and manage orders
            </p>
          </Link>

          {/* Staff Dashboard */}
          <Link 
            to="/staff" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Staff Dashboard
            </h3>
            <p className="text-gray-600">
              General staff operations and tasks
            </p>
          </Link>

          {/* Super Admin */}
          <Link 
            to="/super-admin" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Super Admin
            </h3>
            <p className="text-gray-600">
              Platform administration and analytics
            </p>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Quick Links
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/track-order" 
              className="bg-white px-6 py-3 rounded-lg shadow hover:shadow-md transition"
            >
              Track Order
            </Link>
            <Link 
              to="/api-test" 
              className="bg-white px-6 py-3 rounded-lg shadow hover:shadow-md transition"
            >
              API Test
            </Link>
            <Link 
              to="/login" 
              className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-md hover:bg-orange-600 transition"
            >
              Staff Login
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Demo Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Super Admin</p>
                <p className="text-gray-600">superadmin@spicegarden.com</p>
                <p className="text-gray-600">super123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Admin</p>
                <p className="text-gray-600">admin@spicegarden.com</p>
                <p className="text-gray-600">admin123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Kitchen Staff</p>
                <p className="text-gray-600">kitchen@spicegarden.com</p>
                <p className="text-gray-600">kitchen123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Delivery</p>
                <p className="text-gray-600">delivery@spicegarden.com</p>
                <p className="text-gray-600">delivery123</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Waiter</p>
                <p className="text-gray-600">waiter@spicegarden.com</p>
                <p className="text-gray-600">waiter123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 Spice Garden Restaurant Management System</p>
          <p className="mt-2 text-sm">
            Complete solution for restaurant operations, order management, and delivery tracking
          </p>
        </div>
      </div>
    </div>
  );
}
