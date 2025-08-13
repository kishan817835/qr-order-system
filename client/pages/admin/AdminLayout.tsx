import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  List,
  DollarSign,
  Settings,
  Users,
  BarChart3,
  Menu as MenuIcon,
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import ProfileCard from '../../components/ProfileCard';

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Categories', href: '/admin/categories', icon: List },
  { name: 'Menu Items', href: '/admin/items', icon: MenuIcon },
  { name: 'Extra Charges', href: '/admin/charges', icon: DollarSign },
  { name: 'Delivery Management', href: '/admin/delivery-management', icon: BarChart3 },
  { name: 'Staff Management', href: '/admin/staff', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [adminProfile, setAdminProfile] = useState({
    id: 1,
    name: 'Admin User',
    email: 'admin@spicegarden.com',
    phone: '+91 98765 00000',
    address: 'Restaurant Head Office, Delhi',
    photo: null,
    role: 'admin'
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  const handleUpdateProfile = (updatedProfile: any) => {
    setAdminProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-gray">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''} md:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SG</span>
            </div>
            <div>
              <h2 className="font-bold text-primary">Spice Garden</h2>
              <p className="text-xs text-secondary">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-primary mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Today's Orders</span>
              <span className="font-medium text-primary">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Revenue</span>
              <span className="font-medium text-primary">₹12,450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Active Tables</span>
              <span className="font-medium text-primary">8/15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="admin-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden btn btn-secondary btn-sm"
          >
            <MenuIcon className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-4">
            <Link to="/menu/1" className="btn btn-secondary btn-sm">
              View Menu
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-gray transition"
              >
                <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center">
                  {adminProfile.photo ? (
                    <img src={adminProfile.photo} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-primary">{adminProfile.name}</p>
                  <p className="text-xs text-secondary">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center">
                        {adminProfile.photo ? (
                          <img src={adminProfile.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{adminProfile.name}</p>
                        <p className="text-sm text-secondary">{adminProfile.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-gray rounded-md transition"
                      >
                        <User className="w-4 h-4 mr-2 inline" />
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red hover:bg-gray rounded-md transition"
                      >
                        <LogOut className="w-4 h-4 mr-2 inline" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <Outlet />
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-primary">Admin Profile</h3>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setIsEditingProfile(false);
                }}
                className="text-secondary hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ProfileCard
              user={adminProfile}
              onUpdateProfile={handleUpdateProfile}
              isEditing={isEditingProfile}
              onEditToggle={() => setIsEditingProfile(!isEditingProfile)}
            />
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </div>
  );
}
