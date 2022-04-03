const mongoose = require('mongoose');

/**
 * Personal To Do Schema
 */
const inquirySchema = new mongoose.Schema({
    email: {
        type: String
    },
    subject: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('inquiry', inquirySchema);
