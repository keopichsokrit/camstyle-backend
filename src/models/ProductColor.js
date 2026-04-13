const mongoose = require('mongoose');

const productColorSchema = new mongoose.Schema({
    colorName: { 
        type: String, 
        required: true,
        trim: true 
    },
    hexCode: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductColor', productColorSchema);