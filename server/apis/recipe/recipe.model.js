const mongoose = require('mongoose');

/**
 * Personal To Do Schema
 */
const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    serveSize: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('recipe', recipeSchema);
