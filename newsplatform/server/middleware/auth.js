const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token) return res.status(401).json({ success: false, message: 'Not authorized — login karo' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.isActive) return res.status(401).json({ success: false, message: 'Account disabled' });
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalid ya expire ho gaya' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Sirf admin access kar sakta hai' });
  next();
};

exports.premiumOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Login karo' });
  if (req.user.role === 'admin' || req.user.role === 'editor') return next();
  const sub = req.user.subscription;
  const isPremium = sub &&
    ['basic', 'premium', 'annual'].includes(sub.plan) &&
    sub.status === 'active' &&
    (!sub.endDate || new Date() < new Date(sub.endDate));
  if (!isPremium) return res.status(403).json({ success: false, message: 'Yeh content premium members ke liye hai', requiresUpgrade: true });
  next();
};
