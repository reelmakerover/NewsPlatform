const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email aur password required hai' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password kam se kam 6 characters ka hona chahiye' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: 'Yeh email pehle se registered hai' });

    const user = new User({ name, email, password, phone: phone || '', role: 'user' });
    await user.save();

    const token = signToken(user._id);
    res.status(201).json({ success: true, message: 'Account ban gaya!', token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email aur password daalo' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email ya password galat hai' });
    }
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account disabled hai, admin se contact karo' });

    const token = signToken(user._id);
    res.json({ success: true, token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
