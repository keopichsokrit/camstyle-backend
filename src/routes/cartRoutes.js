const express = require('express');
const router = express.Router();
const { getCart, addToCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Standard users and admins can both have carts
router.route('/')
    .get(protect, getCart)     
    .post(protect, addToCart); 

module.exports = router;