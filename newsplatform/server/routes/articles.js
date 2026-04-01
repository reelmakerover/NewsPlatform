const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articleController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', ctrl.getArticles);
router.get('/trending', ctrl.getTrending);
router.get('/admin', protect, ctrl.getAdminArticles);
router.get('/:slug', ctrl.getArticle);

router.post('/', protect, ctrl.createArticle);
router.put('/:id', protect, ctrl.updateArticle);
router.delete('/:id', protect, adminOnly, ctrl.deleteArticle);
router.post('/upload/thumbnail', protect, upload.single('thumbnail'), ctrl.uploadThumbnail);

module.exports = router;
