const Brand = require('../models/Brand');
const cloudinary = require('cloudinary').v2;

exports.createBrand = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a brand logo file" });
        }

        // Upload to Cloudinary (Folder: brands)
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { 
                    folder: "brands",
                    transformation: [{ width: 400, height: 400, crop: "pad", background: "white" }] 
                },
                (error, uploadResult) => {
                    if (uploadResult) resolve(uploadResult);
                    else reject(error);
                }
            );
            stream.end(req.file.buffer);
        });

        const brand = await Brand.create({
            logoUrl: result.secure_url
        });

        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};