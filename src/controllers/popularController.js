const Order = require('../models/Order');
const PopularItem = require('../models/PopularItem');

// @desc    Analyze all orders and update PopularItem collection
// @route   POST /api/popular/sync
// @access  Admin Only
exports.syncPopularItems = async (req, res) => {
    try {
        // 1. Aggregate: Go into every order, unwind items, sum quantities
        const salesData = await Order.aggregate([
            { $match: { status: "Completed" } }, // Only count successful sales
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.product", 
                    totalSold: { $sum: "$items.quantity" } 
                } 
            },
            { $sort: { totalSold: -1 } }, // Most bought first
            { $limit: 10 } // Top 10 items
        ]);

        // 2. Clear old transcript and save new one
        await PopularItem.deleteMany({});
        
        const popularPromises = salesData.map(item => {
            return PopularItem.create({
                product: item._id,
                totalSold: item.totalSold
            });
        });

        await Promise.all(popularPromises);

        res.status(200).json({ 
            message: "Popular items updated!", 
            count: salesData.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get popular items for the app
// @route   GET /api/popular
// @access  Public
exports.getPopularItems = async (req, res) => {
    try {
        const items = await PopularItem.find().populate('product');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};