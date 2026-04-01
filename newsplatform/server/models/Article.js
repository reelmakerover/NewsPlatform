const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  thumbnailPublicId: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  readTime: { type: Number, default: 5 },
  embeddedVideo: { type: String, default: '' },
  // SEO
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords: [{ type: String }],
  ogImage: { type: String, default: '' }
}, { timestamps: true });

articleSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  // Estimate read time (~200 words/min)
  if (this.isModified('content')) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

articleSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });
articleSchema.index({ status: 1, createdAt: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ views: -1 });

module.exports = mongoose.model('Article', articleSchema);
