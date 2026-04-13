const AppBanner = require('../models/AppBanner');
const cloudinary = require('cloudinary').v2;

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Admin
exports.createBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image file" });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { 
                    folder: "banners",
                    transformation: [{ width: 1080, height: 600, crop: "fill" }] 
                },
                (error, uploadResult) => {
                    if (uploadResult) resolve(uploadResult);
                    else reject(error);
                }
            );
            stream.end(req.file.buffer);
        });

        // Save only the URL
        const banner = await AppBanner.create({
            imageUrl: result.secure_url
        });

        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get all active banners for the Flutter slider
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res) => {
    try {
        const banners = await AppBanner.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Admin
exports.deleteBanner = async (req, res) => {
    try {
        await AppBanner.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Banner removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};