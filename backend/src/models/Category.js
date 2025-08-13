import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
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
  description: {
    type: String,
    default: ''
  },
  image_url: {
    type: String,
    default: ''
  },
  sort_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

categorySchema.index({ restaurant_id: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
