const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getVideos);
router.get('/admin/all', protect, ctrl.getAdminVideos);
router.get('/:slug', ctrl.getVideo);
router.post('/', protect, ctrl.createVideo);
router.put('/:id', protect, ctrl.updateVideo);
router.delete('/:id', protect, adminOnly, ctrl.deleteVideo);

module.exports = router;
