const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/plans', ctrl.getPlans);
router.post('/create-order', protect, ctrl.createOrder);
router.post('/verify', protect, ctrl.verifyPayment);

// Admin
router.get('/admin/plans', protect, adminOnly, ctrl.getAllPlans);
router.post('/plans', protect, adminOnly, ctrl.createPlan);
router.put('/plans/:id', protect, adminOnly, ctrl.updatePlan);
router.delete('/plans/:id', protect, adminOnly, ctrl.deletePlan);
router.get('/subscribers', protect, adminOnly, ctrl.getSubscribers);
router.get('/payments', protect, adminOnly, ctrl.getPayments);
router.post('/grant', protect, adminOnly, ctrl.grantSubscription);

module.exports = router;
