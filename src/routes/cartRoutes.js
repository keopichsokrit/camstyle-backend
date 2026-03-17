const express = require('express');
const router = express.Router();
const { getCart, addToCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Standard users and admins can both have carts
router.route('/')
    .get(protect, getCart)     
    .post(protect, addToCart)
    .delete(protect, clearCart); // This handles clearing the cart and returning stock 

module.exports = router;