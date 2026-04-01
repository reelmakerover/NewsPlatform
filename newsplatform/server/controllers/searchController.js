const Article = require('../models/Article');
const Video = require('../models/Video');

exports.search = async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 10 } = req.query;
    if (!q || q.trim().length < 2) return res.status(400).json({ success: false, message: 'Query too short' });

    const skip = (page - 1) * limit;
    const regex = new RegExp(q.trim(), 'i');
    const results = {};

    if (type === 'all' || type === 'articles') {
      results.articles = await Article.find({
        status: 'published',
        $or: [{ title: regex }, { excerpt: regex }, { tags: regex }]
      }).populate('category', 'name slug color').sort({ views: -1 }).skip(skip).limit(Number(limit)).lean();
    }

    if (type === 'all' || type === 'videos') {
      results.videos = await Video.find({
        status: 'published',
        $or: [{ title: regex }, { description: regex }]
      }).populate('category', 'name slug').limit(5).lean();
    }

    res.json({ success: true, query: q, ...results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.suggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json({ success: true, suggestions: [] });

    const regex = new RegExp(q.trim(), 'i');
    const articles = await Article.find({ status: 'published', title: regex })
      .select('title slug').limit(5).lean();

    res.json({ success: true, suggestions: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
