const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // days
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  color: { type: String, default: '#E03535' },
  razorpayPlanId: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
