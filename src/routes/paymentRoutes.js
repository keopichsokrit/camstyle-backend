const express = require('express');
const router = express.Router();
const { chargeCart, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/charge', protect, chargeCart);
router.post('/verify', protect, verifyPayment);

module.exports = router;