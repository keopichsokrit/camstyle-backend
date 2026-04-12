const Order = require('../models/Order');
const TotalReport = require('../models/TotalReport');
const mongoose = require('mongoose');

// @desc    Calculate total spending from orders
// @route   GET /api/reports/spending
exports.generateTotalReport = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        // 1. Sum all 'totalAmount' from Completed orders
        const stats = await Order.aggregate([
            { $match: { user: userId, status: "Completed" } },
            { 
                $group: { 
                    _id: "$user", 
                    totalAmount: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                } 
            }
        ]);

        if (stats.length === 0) {
            return res.status(200).json({ message: "No completed orders found.", totalSpent: 0 });
        }

        const reportData = {
            totalSpent: stats[0].totalAmount,
            orderCount: stats[0].count,
            lastUpdated: new Date()
        };

        // 2. Save/Update the report in the TotalReport collection
        const report = await TotalReport.findOneAndUpdate(
            { user: userId },
            reportData,
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            user: req.user.name,
            report: report
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};