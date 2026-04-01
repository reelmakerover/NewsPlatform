const Category = require('../models/Category');
const Article = require('../models/Article');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).lean();
    // Add article count
    const withCounts = await Promise.all(categories.map(async (cat) => {
      const count = await Article.countDocuments({ category: cat._id, status: 'published' });
      return { ...cat, articleCount: count };
    }));
    res.json({ success: true, categories: withCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
