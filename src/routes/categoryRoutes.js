const express = require('express');
const { upload } = require('../config/cloudinary');
const router = express.Router();
const { 
    getCategories, 
    createCategory, 
    deleteCategory 
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Anyone can view the list of categories
router.get('/', getCategories);

// Only an Admin can add or remove categories
// router.post('/', protect, admin, createCategory);
router.post('/', protect, admin, upload.single('image'), createCategory);
router.delete('/:id', protect, admin, deleteCategory);


module.exports = router;