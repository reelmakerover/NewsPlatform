const Video = require('../models/Video');

exports.getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = { status: 'published' };
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const [videos, total] = await Promise.all([
      Video.find(query).populate('category', 'name slug color').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Video.countDocuments(query)
    ]);
    res.json({ success: true, videos, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ slug: req.params.slug, status: 'published' }).populate('category', 'name slug');
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    await Video.findByIdAndUpdate(video._id, { $inc: { views: 1 } });
    res.json({ success: true, video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const video = await Video.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, video });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, video });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('category', 'name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
