const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
exports.getNews = async (req, res, next) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (error) { next(error); }
};

// @desc    Create news (ADMIN ONLY)
// @route   POST /api/news
exports.createNews = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const news = await News.create({ title, content });
        res.status(201).json(news);
    } catch (error) { next(error); }
};

// @desc    Delete news (ADMIN ONLY)
// @route   DELETE /api/news/:id
exports.deleteNews = async (req, res, next) => {
    try {
        const news = await News.findById(req.params.id);
        if (news) {
            await news.deleteOne();
            res.json({ message: 'News article removed' });
        } else {
            res.status(404);
            throw new Error('News not found');
        }
    } catch (error) { next(error); }
};