const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) return res.status(404).json({ success: false, message: 'Plan nahi mila' });

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // paise mein
      currency: 'INR',
      receipt: `receipt_${req.user._id}_${Date.now()}`,
      notes: { userId: req.user._id.toString(), planId: plan._id.toString() }
    });

    // Save pending payment
    await Payment.create({
      user: req.user._id,
      plan: plan._id,
      amount: plan.price,
      razorpayOrderId: order.id,
      status: 'pending'
    });

    res.json({
      success: true,
      order,
      plan: { name: plan.name, price: plan.price, duration: plan.duration },
      key: process.env.RAZORPAY_KEY_ID,
      user: { name: req.user.name, email: req.user.email, phone: req.user.phone }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan nahi mila' });

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: 'success', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature }
    );

    // Update user subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': plan.slug,
      'subscription.status': 'active',
      'subscription.startDate': startDate,
      'subscription.endDate': endDate,
      'subscription.razorpayOrderId': razorpay_order_id,
      'subscription.razorpayPaymentId': razorpay_payment_id,
      role: 'subscriber'
    });

    const updatedUser = await User.findById(req.user._id);
    res.json({ success: true, message: `🎉 ${plan.name} plan activate ho gaya!`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all plans (public)
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create/Update plan
exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all subscribers
exports.getSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find({ role: { $in: ['subscriber', 'user'] } }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments({ role: { $in: ['subscriber', 'user'] } })
    ]);
    res.json({ success: true, users, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get payment history
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'success' })
      .populate('user', 'name email phone')
      .populate('plan', 'name price')
      .sort({ createdAt: -1 })
      .limit(100);
    const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
    res.json({ success: true, payments, totalRevenue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Manually grant subscription
exports.grantSubscription = async (req, res) => {
  try {
    const { userId, planId, days } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan nahi mila' });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (days || plan.duration));

    await User.findByIdAndUpdate(userId, {
      'subscription.plan': plan.slug,
      'subscription.status': 'active',
      'subscription.startDate': new Date(),
      'subscription.endDate': endDate,
      role: 'subscriber'
    });

    res.json({ success: true, message: 'Subscription manually granted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all plans (including inactive)
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
