const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe'
    },
    quantity: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Cart', CartSchema);