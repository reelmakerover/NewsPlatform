require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../models/Plan');

const plans = [
  {
    name: 'Free',
    slug: 'free',
    description: 'Basic access to public articles',
    price: 0,
    duration: 36500,
    features: ['Latest news articles', 'Video reels', 'Search functionality', 'Breaking news ticker'],
    isActive: true,
    isPopular: false,
    color: '#8b7d62'
  },
  {
    name: 'Basic',
    slug: 'basic',
    description: 'Full access to all articles and analysis',
    price: 99,
    duration: 30,
    features: ['Everything in Free', 'All premium articles', 'In-depth analysis', 'No ads', 'Early access to breaking news'],
    isActive: true,
    isPopular: false,
    color: '#6366F1'
  },
  {
    name: 'Premium',
    slug: 'premium',
    description: 'Complete access + exclusive content',
    price: 249,
    duration: 90,
    features: ['Everything in Basic', '3 months access', 'Exclusive investigative reports', 'PDF downloads', 'Priority support', 'Ad-free experience'],
    isActive: true,
    isPopular: true,
    color: '#E03535'
  },
  {
    name: 'Annual',
    slug: 'annual',
    description: 'Best value — full year access',
    price: 799,
    duration: 365,
    features: ['Everything in Premium', '12 months access', 'Save 73% vs monthly', 'Exclusive newsletter', 'Early beta features'],
    isActive: true,
    isPopular: false,
    color: '#F59E0B'
  }
];

async function seedPlans() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsplatform');
  await Plan.deleteMany();
  await Plan.insertMany(plans);
  console.log('✅ Plans seeded:');
  plans.forEach(p => console.log(`   ${p.name} — ₹${p.price}/${p.duration} days`));
  process.exit(0);
}

seedPlans().catch(err => { console.error(err); process.exit(1); });
