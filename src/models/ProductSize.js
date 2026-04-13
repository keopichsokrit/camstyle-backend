const mongoose = require('mongoose');

const productSizeSchema = new mongoose.Schema({
    sizeValue: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true // Removes accidental spaces like " M "
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductSize', productSizeSchema);