const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,

    },
    state: {
        type: String,
        required: true,

    },
    zip_code: {
        type: Number,
        required: true,

    },
    address1: {
        type: String,
        required: true,

    },
    city: {
        type: String,
        required: true
    },
    city1: {
        type: String,
        required: true
    },
    gst_number: {
        type: String,
        required: true
    },
    pan_card_number: {
        type: String,
        required: true
    },
    bank_name: {
        type: String,
        required: true
    },
    account_no: {
        type: Number,
        required: true
    },
    bank_address: {
        type: String,
        required: true
    },
    ifsc_code: {
        type: String,
        required: true
    },

    p_name: {
        type: String,
        required: true
    },
    p_contact: {
        type: Number,
        required: true
    },
    p_alternate_contact: {
        type: Number,
        required: true
    },
    p_email: {
        type: String,
        required: true
    },
    p_alternate_email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },

    p_designation: {
        type: String,
        required: true
    },



    gst_url: {
        type: [],

    },

    pan_url: {
        type: [],

    },
    noc_url: {
        type: [],

    },
    cheque_url: {
        type: [],

    },
    contact_section_data: [
        {
            d_name: {
                type: String
            },
            d_designation: {
                type: String
            },
            d_contact: {
                type: Number
            },
            d_contact_alternate: {
                type: Number
            },
            d_email: {
                type: String
            },
            d_email_alternate: {
                type: String
            },
            pan_number: {
                type: String,
                default:null
            },
            pan_url:{
                type:[],
                default:[]
            }
        }

    ],
    sale_data: [
        {
            s_name: {
                type: String
            },
            s_designation: {
                type: String
            },
            s_number: {
                type: Number
            },
            s_number_alternate: {
                type: Number
            },
            s_email: {
                type: String
            },
            s_email_alternate: {
                type: String
            },
        }

    ],
    ban_number_input: {
        type: String,
    },
    // ---------new filed ---//
    mode_of_payment : {
        type: String,
        default:null
    },
    micr_code : {
        type: String,
        default:null
    },
    default_currency : {
        type: String,
        default:null
    },
    incoterms_location : {
        type: String,
        default:null
    },
    gst_range : {
        type: String,
        default:null
    },
    gst_division : {
        type: String,
        default:null
    },
    gst_commissionerate : {
        type: String,
        default:null
    },
    hsn_sac : {
        type: String,
        default:null
    },
    msme_no : {
        type: String,
        default:null
    },
    ssi_no : {
        type: String,
        default:null
    },
    payment_terms : {
        type: String,
        default:null
    },
    accounting_ref : {
        type: String,
        default:null
    },
    sales_ref : {
        type: String,
        default:null
    },
    delivery_terms : {
        type: String,
        default:null
    },
    financial_supplier : {
        type: String,
        default:null
    },
    s_name_as_per_name : {
        type: String,
        default:null
    },
    supplier_type : {
        type: String,
        default:null
    },
    type_of_item : {
        type: String,
        default:null
    },



    vendor_id: {
        type: mongoose.Types.ObjectId,
        ref: "vendors",
        index: true,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    for_update: {
        type: Boolean,
        default: true
    }
} ,{
    timestamps: true,
});



module.exports = mongoose.model('vendors_firm', vendorSchema);
