import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menu_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  special_instructions: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  order_number: {
    type: String,
    unique: true,
    required: true
  },
  customer_name: {
    type: String,
    default: ''
  },
  customer_phone: {
    type: String,
    default: ''
  },
  customer_email: {
    type: String,
    default: ''
  },
  service_type: {
    type: String,
    enum: ['dining', 'takeaway', 'delivery'],
    required: true
  },
  table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    default: null
  },
  table_number: {
    type: Number,
    default: null
  },
  delivery_address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    landmark: String,
    delivery_instructions: String
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax_amount: {
    type: Number,
    default: 0
  },
  service_charge: {
    type: Number,
    default: 0
  },
  delivery_charge: {
    type: Number,
    default: 0
  },
  discount_amount: {
    type: Number,
    default: 0
  },
  total_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet'],
    default: 'cash'
  },
  special_instructions: {
    type: String,
    default: ''
  },
  estimated_time: {
    type: Number, // in minutes
    default: 30
  },
  actual_preparation_time: {
    type: Number,
    default: null
  },
  delivery_time: {
    type: Date,
    default: null
  },
  assigned_staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  qr_code_id: {
    type: String,
    default: ''
  },
  order_source: {
    type: String,
    enum: ['qr_scan', 'app', 'website', 'phone', 'walk_in'],
    default: 'qr_scan'
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments({ restaurant_id: this.restaurant_id });
    this.order_number = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

orderSchema.index({ restaurant_id: 1, status: 1 });
orderSchema.index({ restaurant_id: 1, service_type: 1 });
orderSchema.index({ order_number: 1 });
orderSchema.index({ table_id: 1 });

export default mongoose.model('Order', orderSchema);
