const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: [String],// URL from Cloudinary
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);