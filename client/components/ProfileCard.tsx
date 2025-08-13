import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit3, 
  Save,
  X
} from 'lucide-react';

interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
  role: string;
}

interface ProfileCardProps {
  user: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  isEditing?: boolean;
  onEditToggle?: () => void;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileCard({ user, onUpdateProfile, isEditing = false, onEditToggle }: ProfileCardProps) {
  const [editedUser, setEditedUser] = useState<UserProfile>(user);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateProfile = () => {
    const newErrors: any = {};
    
    if (!editedUser.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!editedUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!editedUser.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(editedUser.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateProfile()) return;
    onUpdateProfile(editedUser);
    if (onEditToggle) onEditToggle();
  };

  const handleCancel = () => {
    setEditedUser(user);
    setErrors({});
    if (onEditToggle) onEditToggle();
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
    if (!passwordData.currentPassword) {
      alert('Please enter your current password!');
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedUser({...editedUser, photo: e.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '👨‍💼';
      case 'kitchen': return '👨‍🍳';
      case 'delivery': return '🚚';
      case 'staff': return '👨‍💻';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-purple-600 text-white';
      case 'kitchen': return 'bg-orange text-white';
      case 'delivery': return 'bg-blue-600 text-white';
      case 'staff': return 'bg-green text-white';
      default: return 'bg-gray text-white';
    }
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary">Profile Information</h3>
          {onEditToggle && (
            <button
              onClick={onEditToggle}
              className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-orange rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                {(isEditing ? editedUser.photo : user.photo) ? (
                  <img 
                    src={isEditing ? editedUser.photo! : user.photo!} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover" 
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-3 right-0 bg-orange text-white p-2 rounded-full cursor-pointer hover:bg-orange-dark transition">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            {/* Role Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
              <span className="mr-1">{getRoleIcon(user.role)}</span>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} User
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="form-label flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'border-red' : ''}`}
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  />
                  {errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
                </>
              ) : (
                <p className="text-primary font-medium">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="form-label flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'border-red' : ''}`}
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  />
                  {errors.email && <p className="text-red text-sm mt-1">{errors.email}</p>}
                </>
              ) : (
                <p className="text-primary">{user.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="form-label flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'border-red' : ''}`}
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                  />
                  {errors.phone && <p className="text-red text-sm mt-1">{errors.phone}</p>}
                </>
              ) : (
                <p className="text-primary">{user.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="form-label flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  className="form-input"
                  rows={3}
                  value={editedUser.address}
                  onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
                />
              ) : (
                <p className="text-primary">{user.address}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn btn-secondary flex-1"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
            
            {isEditing && (
              <>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

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
                <X className="w-5 h-5" />
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
                    placeholder="Enter current password"
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
                    placeholder="Enter new password"
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
                    placeholder="Confirm new password"
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
    </>
  );
}
