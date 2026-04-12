const express = require('express');
const router = express.Router();
const { getNews, createNews, deleteNews } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

// Public can read news, only Admin/Protected users can post or delete
router.route('/')
    .get(getNews)
    .post(protect, createNews);

router.route('/:id')
    .delete(protect, deleteNews);

module.exports = router;