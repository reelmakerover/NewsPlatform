const Article = require('../models/Article');
const cloudinary = require('../utils/cloudinary');

exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = 'published', featured, trending } = req.query;
    const query = { status };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (trending === 'true') query.isTrending = true;

    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      Article.find(query).populate('author', 'name avatar').populate('category', 'name slug color icon')
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Article.countDocuments(query)
    ]);

    res.json({ success: true, articles, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar').populate('category', 'name slug color icon');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    // Increment views
    await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });
    article.views += 1;

    // Related articles
    const related = await Article.find({ category: article.category._id, _id: { $ne: article._id }, status: 'published' })
      .populate('category', 'name slug color icon').limit(4).lean();

    res.json({ success: true, article, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('category', 'name slug color icon')
      .sort({ views: -1 }).limit(10).lean();
    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    if (article.thumbnailPublicId) await cloudinary.uploader.destroy(article.thumbnailPublicId);
    await article.deleteOne();
    res.json({ success: true, message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, url: req.file.path, publicId: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAdminArticles = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      Article.find(query).populate('author', 'name').populate('category', 'name color')
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Article.countDocuments(query)
    ]);
    res.json({ success: true, articles, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
