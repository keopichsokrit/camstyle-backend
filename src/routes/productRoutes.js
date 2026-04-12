const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    updateProductImages,
    getMyWishlist,   // <--- ADD THIS
    toggleWishlist, 
    createProductReview, 
    getAllReviews
    
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// --- WISHLIST ROUTES (Must be above /:id) ---
// Note: These are 'protect' only because any logged-in user can have a wishlist
router.get('/wishlist', protect, getMyWishlist);
router.post('/wishlist/:id', protect, toggleWishlist);
// Public routes (Users can browse)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Admin routes (Only Admins can modify)
// router.post('/', protect, admin, createProduct);
// Update the POST route to include the upload middleware
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, updateProduct);
router.put('/:id/images', protect, admin, upload.array('images', 5), updateProductImages);
router.delete('/:id', protect, admin, deleteProduct);
// --- NEW REVIEW ROUTES ---
// GET /api/products/:id/reviews -> Get reviews for this product
// POST /api/products/:id/reviews -> Post a review (Must be logged in)
router.route('/:id/reviews')
    .get(getAllReviews)
    .post(protect, createProductReview);


module.exports = router;