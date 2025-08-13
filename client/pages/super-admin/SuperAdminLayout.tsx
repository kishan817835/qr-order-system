import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Admins", href: "/super-admin/admins", icon: Users },
  { name: "Restaurants", href: "/super-admin/restaurants", icon: Building2 },
  { name: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-orange-600" />
              <span className="font-bold text-gray-900">Super Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/super-admin" &&
                  location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-64">
        <div className="bg-white shadow-lg h-full">
          <div className="flex items-center space-x-2 p-6 border-b">
            <Crown className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="font-bold text-gray-900">Super Admin</h1>
              <p className="text-sm text-gray-600">Platform Control</p>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/super-admin" &&
                  location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar for mobile */}
        <div className="lg:hidden bg-white shadow border-b">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-orange-600" />
              <span className="font-bold text-gray-900">Super Admin</span>
            </div>
            <div></div>
          </div>
        </div>

        {/* Page content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
