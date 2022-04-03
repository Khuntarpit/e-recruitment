const mongoose = require('mongoose');
const Utils = require('../../helpers/util');

/* User Schema */

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        index: true
    },
    profile: String,
    password: { type: String, required: true },
    CVIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cv'
    }],
    // location: { type: Object, required: true },
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
    userName: {
        type: String, required: true
    },
    firstName: { type: String },
    lastName: { type: String },

    role: {
        type: String,
        default: 'user'
    },
    examSubmit: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },

},
    {
        timestamps: true
    });


UserSchema.statics.login = function (email, password, role) {
    return this.findOne({
        email: email,
        password: password,
        role: role,
        isActive: true,
    }).exec();
};

UserSchema.statics.getAll = function () {
    return this.find().sort({ createdAt: -1 }).exec();
};
UserSchema.statics.findByRole = function (role) {
    return this.find({ role: role }).exec();
};

UserSchema.statics.findEmail = function (email, role) {
    return this.findOne({ email: email, role: role }).exec();
};
UserSchema.statics.findById = function (id) {
    return this.findOne({ _id: id }).exec();
};

UserSchema.statics.delete = function (id) {
    return this.findOneAndUpdate({
        _id: id,
        isActive: { $ne: false }
    }, {
        $set: { isActive: false }
    },
        { new: true } // returns updated record
    );
};

module.exports = mongoose.model('User', UserSchema);

