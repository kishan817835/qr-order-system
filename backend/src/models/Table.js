import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const tableSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  table_number: {
    type: Number,
    required: true
  },
  chair_count: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  qr_code_id: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  qr_code_url: {
    type: String,
    default: ''
  },
  qr_code_image: {
    type: String,
    default: ''
  },
  last_used: {
    type: Date
  },
  current_order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique table numbers per restaurant
tableSchema.index({ restaurant_id: 1, table_number: 1 }, { unique: true });

// Pre-save middleware to generate QR code URL
tableSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('table_number')) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    this.qr_code_url = `${frontendUrl}/menu/${this.restaurant_id}?table=${this.table_number}&service=dining&qr_id=${this.qr_code_id}`;
  }
  next();
});

export default mongoose.model('Table', tableSchema);
