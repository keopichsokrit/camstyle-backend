const ProductColor = require('../models/ProductColor');

// @desc    Add new colors (Single or Array)
// @route   POST /api/colors
// @access  Admin
exports.createColor = async (req, res) => {
    try {
        const { colors } = req.body; // Expecting { "colors": [{"colorName": "Red", "hexCode": "#FF0000"}] }

        if (!colors || !Array.isArray(colors)) {
            return res.status(400).json({ message: "Please provide an array of colors" });
        }

        const newColors = await ProductColor.insertMany(colors, { ordered: false });
        res.status(201).json({ success: true, data: newColors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all colors
// @route   GET /api/colors
// @access  Public
exports.getColors = async (req, res) => {
    try {
        const colors = await ProductColor.find().sort({ colorName: 1 });
        res.status(200).json(colors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};