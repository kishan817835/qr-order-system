import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Grid3X3, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Settings
} from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  discount?: number;
  isPriority?: boolean;
}

interface Category {
  id: number;
  name: string;
  items: MenuItem[];
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
}

export default function GeneralStaffDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'profile'>('categories');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Rohit Sharma',
    email: 'rohit.sharma@spicegarden.com',
    phone: '+91 98765 66666',
    address: 'Block A, Sector 15, Noida, UP',
    photo: null
  });

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: 'Appetizers',
      items: [
        {
          id: 1,
          name: 'Samosa',
          description: 'Crispy pastry with spiced potato filling',
          price: 25,
          image_url: '/placeholder.svg',
          category_id: 1
        },
        {
          id: 2,
          name: 'Pakora',
          description: 'Deep fried vegetable fritters',
          price: 35,
          image_url: '/placeholder.svg',
          category_id: 1
        }
      ]
    },
    {
      id: 2,
      name: 'Main Course',
      items: [
        {
          id: 3,
          name: 'Dal Tadka',
          description: 'Yellow lentils with tempering',
          price: 120,
          image_url: '/placeholder.svg',
          category_id: 2
        },
        {
          id: 4,
          name: 'Paneer Butter Masala',
          description: 'Cottage cheese in rich tomato gravy',
          price: 180,
          image_url: '/placeholder.svg',
          category_id: 2
        }
      ]
    },
    {
      id: 3,
      name: 'Beverages',
      items: [
        {
          id: 5,
          name: 'Masala Chai',
          description: 'Spiced Indian tea',
          price: 15,
          image_url: '/placeholder.svg',
          category_id: 3
        }
      ]
    }
  ]);

  const allItems = categories.flatMap(cat => cat.items);
  const filteredItems = searchTerm 
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedCategory 
      ? allItems.filter(item => item.category_id === selectedCategory)
      : allItems;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setShowProfileModal(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Simulate password change
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const addCategory = () => {
    const name = prompt('Enter category name:');
    if (name && name.trim()) {
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: name.trim(),
        items: []
      };
      setCategories([...categories, newCategory]);
    }
  };

  const editCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newName = prompt('Enter new category name:', category.name);
    if (newName && newName.trim()) {
      setCategories(categories.map(c => 
        c.id === categoryId ? { ...c, name: newName.trim() } : c
      ));
    }
  };

  const deleteCategory = (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category? All items in this category will also be deleted.')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const addItem = () => {
    const name = prompt('Enter item name:');
    if (!name || !name.trim()) return;

    const description = prompt('Enter item description:') || '';
    const priceStr = prompt('Enter item price:');
    const price = parseFloat(priceStr || '0');
    
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price!');
      return;
    }

    const categoryId = selectedCategory || categories[0]?.id;
    if (!categoryId) {
      alert('Please select a category first!');
      return;
    }

    const newItem: MenuItem = {
      id: Math.max(...allItems.map(i => i.id), 0) + 1,
      name: name.trim(),
      description,
      price,
      image_url: '/placeholder.svg',
      category_id: categoryId
    };

    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { ...category, items: [...category.items, newItem] }
        : category
    ));
  };

  const editItem = (itemId: number) => {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    const name = prompt('Enter item name:', item.name);
    if (!name || !name.trim()) return;

    const description = prompt('Enter item description:', item.description) || '';
    const priceStr = prompt('Enter item price:', item.price.toString());
    const price = parseFloat(priceStr || '0');
    
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price!');
      return;
    }

    setCategories(categories.map(category => ({
      ...category,
      items: category.items.map(i => 
        i.id === itemId 
          ? { ...i, name: name.trim(), description, price }
          : i
      )
    })));
  };

  const deleteItem = (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setCategories(categories.map(category => ({
        ...category,
        items: category.items.filter(i => i.id !== itemId)
      })));
    }
  };

  return (
    <div className="min-h-screen bg-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold">SG</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Staff Dashboard</h1>
              <p className="text-sm text-secondary">General Staff Portal</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Profile Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-gray transition"
            >
              <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center">
                {userProfile.photo ? (
                  <img src={userProfile.photo} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-primary">{userProfile.name}</p>
                <p className="text-xs text-secondary">General Staff</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="flex space-x-8 px-4">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 border-b-2 transition ${
              activeTab === 'categories'
                ? 'border-orange text-orange font-medium'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <Grid3X3 className="w-4 h-4 mr-2 inline" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-4 border-b-2 transition ${
              activeTab === 'items'
                ? 'border-orange text-orange font-medium'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <Package className="w-4 h-4 mr-2 inline" />
            Menu Items
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">Categories</h2>
                <p className="text-secondary">Manage menu categories</p>
              </div>
              <button onClick={addCategory} className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-primary">{category.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editCategory(category.id)}
                        className="text-secondary hover:text-primary"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="text-red hover:text-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-secondary">
                    {category.items.length} items
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setActiveTab('items');
                    }}
                    className="btn btn-secondary btn-sm mt-3 w-full"
                  >
                    View Items
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items Tab */}
        {activeTab === 'items' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">Menu Items</h2>
                <p className="text-secondary">Manage menu items and pricing</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform translate-y-neg-half text-secondary" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="form-input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="form-input"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button onClick={addItem} className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const category = categories.find(c => c.id === item.category_id);
                return (
                  <div key={item.id} className="card">
                    <div className="w-full aspect-square overflow-hidden rounded-lg bg-muted mb-4">
                      <img 
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-primary">{item.name}</h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editItem(item.id)}
                          className="text-secondary hover:text-primary"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red hover:text-red"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-secondary mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">₹{item.price}</span>
                      <span className="text-xs text-secondary bg-muted px-2 py-1 rounded">
                        {category?.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-secondary">No items found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">My Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-secondary hover:text-primary"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile Photo */}
              <div className="text-center">
                <div className="w-20 h-20 bg-orange rounded-full flex items-center justify-center mx-auto mb-3">
                  {userProfile.photo ? (
                    <img src={userProfile.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <button className="btn btn-secondary btn-sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="form-label flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                />
              </div>

              {/* Email */}
              <div>
                <label className="form-label flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="form-label flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                />
              </div>

              {/* Address */}
              <div>
                <label className="form-label flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                />
              </div>

              {/* Password Change Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn btn-secondary w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>

              {/* Save Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateProfile(userProfile)}
                  className="btn btn-primary flex-1"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-secondary hover:text-primary"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="form-label">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="form-input pr-10"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="form-label">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-input pr-10"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="form-label">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input pr-10"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="btn btn-primary flex-1"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
