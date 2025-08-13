import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'manager', 'kitchen_staff', 'waiter', 'delivery_boy', 'customer'],
    default: 'customer'
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    default: null
  },
  // For super admin - they can manage multiple restaurants through admin users
  managed_restaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  permissions: [{
    type: String
  }],
  profile_image: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: { type: String, default: 'India' }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  // Super admin specific fields
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Statistics for super admin view
  total_restaurants_managed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ role: 1 });
userSchema.index({ restaurant_id: 1, role: 1 });
userSchema.index({ created_by: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Check if user has permission
userSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true; // Super admin has all permissions
  return this.permissions.includes(permission);
};

// Check if user can manage restaurant
userSchema.methods.canManageRestaurant = function(restaurantId) {
  if (this.role === 'super_admin') return true;
  if (this.role === 'admin' && this.restaurant_id?.toString() === restaurantId.toString()) return true;
  return false;
};

export default mongoose.model('User', userSchema);
