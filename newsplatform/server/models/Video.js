const mongoose = require('mongoose');
const slugify = require('slugify');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  videoType: { type: String, enum: ['youtube', 'instagram', 'direct'], default: 'youtube' },
  thumbnail: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  duration: { type: String, default: '' },
  tags: [{ type: String }]
}, { timestamps: true });

videoSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Video', videoSchema);
