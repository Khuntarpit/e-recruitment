const mongoose = require('mongoose');
const Utils = require('../../helpers/util');

/* User Schema */

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        index: true
    },
    profile: String,
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: {
        type: String, required: true
    },
    location: {
        address: String,
        buildingNo: String,
        country: String,
        state: String,
        city: String,
        zipCode: String,
        houseType: String,
        type: { type: String, default: "Point" },
        coordinates: Array
    },
    role: {
        type: String,
        default: 'admin'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


AdminSchema.statics.login = function (email, password) {
    return this.findOne({
        email: email,
        password: password,
        isActive: true,
    }).exec();
};

AdminSchema.statics.getAll = function () {
    return this.find().sort({ createdAt: -1 }).exec();
};

AdminSchema.statics.findEmail = function (email) {
    return this.findOne({ email: email }).exec();
};
AdminSchema.statics.findById = function (id) {
    return this.findOne({ _id: id }).exec();
};

AdminSchema.statics.delete = function (id) {
    return this.findOneAndUpdate({
        _id: id,
        isActive: { $ne: false }
    }, {
        $set: { isActive: false }
    },
        { new: true } // returns updated record
    );
};

module.exports = mongoose.model('Admin', AdminSchema);

