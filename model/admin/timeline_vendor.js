const mongoose = require("mongoose");
const vendors_schema = new mongoose.Schema(
    {
        vendor_id: {
            type: mongoose.Types.ObjectId,
            ref: "vendors",
            index: true
        },
        type: {
            type: String,
            default: ""
        },
        remark: {
            type: String,
            default: ""
        },
        comment: {
            type: String,

        },

        attachment: {
            type: [],

        },
        action_status: {
            type: Number,

        },
        operator_by: {
            type: mongoose.Types.ObjectId,
            ref: "adminUSers",
            index: true,
            default:null
        },
        forwarded_to: {
            type: mongoose.Types.ObjectId,
            ref: "adminUSers",
            index: true,
            default:null

        },
        operator_type: {
            type: String,
            default: "",
            default:null

        },

    },
    {
        timestamps: true,
    }
);
var vendors_module = mongoose.model(
    "vendor_timeline",
    vendors_schema
);
module.exports = vendors_module;
