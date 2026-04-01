const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'editor', 'subscriber', 'user'], default: 'user' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    status: { type: String, enum: ['active', 'expired', 'cancelled', 'pending'], default: 'active' },
    startDate: { type: Date },
    endDate: { type: Date },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isPremium = function() {
  if (this.role === 'admin' || this.role === 'editor') return true;
  if (!this.subscription) return false;
  const plan = this.subscription.plan;
  const status = this.subscription.status;
  const end = this.subscription.endDate;
  return (plan === 'basic' || plan === 'premium') && status === 'active' && (!end || new Date() < new Date(end));
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
