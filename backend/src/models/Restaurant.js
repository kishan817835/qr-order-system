import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo_url: {
    type: String,
    default: ''
  },
  banner_url: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  cuisine_type: {
    type: String,
    default: 'Multi-Cuisine'
  },
  opening_hours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  settings: {
    tax_rate: { type: Number, default: 18 },
    service_charge: { type: Number, default: 10 },
    delivery_charge: { type: Number, default: 50 },
    min_order_amount: { type: Number, default: 200 },
    currency: { type: String, default: 'INR' }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Restaurant', restaurantSchema);
