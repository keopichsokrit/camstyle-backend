const mongoose = require('mongoose');

const popularItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    totalSold: { 
        type: Number, 
        required: true 
    },
    lastCalculated: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('PopularItem', popularItemSchema);