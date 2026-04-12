const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, // Stores the reviewer's name at time of posting
    rating: { 
        type: Number, 
        required: true, 
        default: 5 
    },
    comment: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);