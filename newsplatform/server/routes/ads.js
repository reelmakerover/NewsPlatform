const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adController');
const { protect, adminOnly } = require('../middleware/auth');

// Public
router.get('/', ctrl.getAdsByPosition);
router.post('/:id/click', ctrl.trackClick);
router.post('/:id/impression', ctrl.trackImpression);

// Admin
router.get('/admin/all', protect, adminOnly, ctrl.getAllAds);
router.post('/', protect, adminOnly, ctrl.createAd);
router.put('/:id', protect, adminOnly, ctrl.updateAd);
router.delete('/:id', protect, adminOnly, ctrl.deleteAd);

module.exports = router;
