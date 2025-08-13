import mongoose from 'mongoose';

const extraChargeSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['fixed', 'percentage'],
    required: true
  },
  applicable_on: {
    type: String,
    enum: ['all', 'dining', 'takeaway', 'delivery'],
    default: 'all'
  },
  description: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ExtraCharge', extraChargeSchema);
