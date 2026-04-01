const Ad = require('../models/Ad');

// Public: Get ads by position
exports.getAdsByPosition = async (req, res) => {
  try {
    const { position, page = 'all' } = req.query;
    const now = new Date();
    const query = {
      isActive: true,
      $or: [{ startDate: { $lte: now } }, { startDate: null }],
      $and: [{ $or: [{ endDate: { $gte: now } }, { endDate: null }] }]
    };
    if (position) query.position = position;
    if (page !== 'all') {
      query.$or = [
        { showOnPages: 'all' },
        { showOnPages: page },
        { showOnPages: { $size: 0 } }
      ];
    }
    const ads = await Ad.find(query).lean();
    res.json({ success: true, ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Track click
exports.trackClick = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Track impression
exports.trackImpression = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all ads
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json({ success: true, ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create ad
exports.createAd = async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json({ success: true, ad });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Update ad
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.json({ success: true, ad });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Delete ad
exports.deleteAd = async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ad deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
