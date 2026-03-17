const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // Use the same upload as products

// Standard PUT route for profile
router.put('/update', protect, upload.single('image'), updateProfile);

module.exports = router;