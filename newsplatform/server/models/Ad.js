const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { 
    type: String, 
    enum: ['top-banner', 'mid-article', 'bottom-banner', 'sidebar', 'popup', 'between-articles'],
    required: true 
  },
  type: { type: String, enum: ['image', 'html', 'adsense'], default: 'image' },
  // Image ad
  imageUrl: { type: String, default: '' },
  linkUrl: { type: String, default: '' },
  altText: { type: String, default: '' },
  // HTML/custom ad code
  htmlCode: { type: String, default: '' },
  // AdSense slot
  adsenseSlot: { type: String, default: '' },
  // Settings
  isActive: { type: Boolean, default: true },
  showOnPages: [{ type: String }], // ['home', 'article', 'category', 'all']
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  // Schedule
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
