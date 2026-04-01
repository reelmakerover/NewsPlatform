const express = require('express');
const router = express.Router();
const { sendBulkEmail, sendBulkSMS, getBroadcastStats } = require('../controllers/broadcastController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', getBroadcastStats);
router.post('/email', sendBulkEmail);
router.post('/sms', sendBulkSMS);

module.exports = router;
