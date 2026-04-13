const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    logoUrl: { 
        type: String, 
        required: true // Cloudinary URL for the brand logo
    }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);