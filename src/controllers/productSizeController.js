const ProductSize = require('../models/ProductSize');

// @desc    Add a new universal size
// @route   POST /api/sizes
// @access  Admin
exports.createSize = async (req, res) => {
    try {
        const { sizes } = req.body; // Expecting an array: { "sizes": ["S", "M", "L"] }

        if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
            return res.status(400).json({ message: "Please provide an array of sizes" });
        }

        // Prepare the objects for Mongoose
        const sizeObjects = sizes.map(val => ({ sizeValue: val.trim() }));

        // insertMany handles the bulk creation
        // ordered: false allows successful inserts to continue even if one fails (like a duplicate)
        const newSizes = await ProductSize.insertMany(sizeObjects, { ordered: false });

        res.status(201).json({
            success: true,
            count: newSizes.length,
            data: newSizes
        });
    } catch (error) {
        // If some inserts failed due to duplicates, we can still return the partial success
        if (error.writeErrors) {
            return res.status(207).json({ 
                message: "Some sizes already existed and were skipped.",
                insertedCount: error.insertedDocs.length 
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all sizes for the user to choose
// @route   GET /api/sizes
// @access  Public
exports.getSizes = async (req, res) => {
    try {
        const sizes = await ProductSize.find().sort({ createdAt: 1 });
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};