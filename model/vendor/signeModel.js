const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({

    approved_user: {
        type: mongoose.Types.ObjectId,
        ref: "adminUSers",
        index: true
    },
    operator_type: {
        type: String,
        default: ""
    },
    vendor_id: {
        type: mongoose.Types.ObjectId,
        ref: "vendors",
        index: true
    },
    status: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true,
});



module.exports = mongoose.model('sign_masters', vendorSchema);
