const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const Order = require('../models/Order');

exports.syncFavorites = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        // This aggregation matches your screenshot structure:
        // user: ObjectId(...) and items: [ { product: ObjectId(...), quantity: 1 } ]
        const frequentPurchases = await Order.aggregate([
            { $match: { user: userId } },
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.product", 
                    totalQuantity: { $sum: "$items.quantity" } 
                } 
            },
            { $match: { totalQuantity: { $gte: 5 } } } // The "Magic 5" limit
        ]);

        if (frequentPurchases.length === 0) {
            return res.status(200).json({ 
                message: "No products reached 5 purchases yet.",
                status: "success",
                data: [] 
            });
        }

        const favoritePromises = frequentPurchases.map(item => {
            return Favorite.findOneAndUpdate(
                { user: userId, product: item._id },
                { user: userId, product: item._id, autoAdded: true },
                { upsert: true, new: true }
            );
        });

        await Promise.all(favoritePromises);

        res.status(200).json({ 
            message: "Favorites synced successfully!", 
            count: frequentPurchases.length 
        });

    } catch (error) {
        res.status(500).json({ message: "Sync Error", error: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate('product')
            .sort({ createdAt: -1 });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};