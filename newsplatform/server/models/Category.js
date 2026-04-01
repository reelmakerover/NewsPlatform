const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  color: { type: String, default: '#E63946' },
  icon: { type: String, default: '📰' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
