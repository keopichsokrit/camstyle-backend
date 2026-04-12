const express = require('express');
const router = express.Router();
const favoriteCtrl = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/sync', protect, favoriteCtrl.syncFavorites);
router.get('/', protect, favoriteCtrl.getFavorites);

module.exports = router;