require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
  credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/userAuth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/search', require('./routes/search'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/broadcast', require('./routes/broadcast'));
app.use('/api/ads', require('./routes/ads'));
app.use('/', require('./routes/sitemap'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsplatform')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server on port ${process.env.PORT || 5000}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
