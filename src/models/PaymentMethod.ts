import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['mobile_banking', 'crypto', 'bank']
  },
  icon: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  minimumAmount: {
    type: Number,
    required: true,
    min: 0
  },
  maximumAmount: {
    type: Number,
    required: true,
    min: 0
  },
  processingTime: {
    type: String,
    required: true
  },
  fees: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema); 