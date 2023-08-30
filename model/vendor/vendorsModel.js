const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  username: {
    type: String,


  },

  mobile_number: {
    type: Number,
    default: null
    // required: true,

  },
  email: {
    type: String,
    required: true,

  },
  password: {
    type: String,

  },

  comment: {
    type: String,

  },
  download_attachment: {
    type: []

  },

  attachment: {
    type: [],

  },
  code_of_conduct: {
    type: [],

  },
  it_deceleration: {
    type: [],

  },
  firm_type: {
    type: Number,
    default: null
  },
  link_status: {
    type: Number,
    default: 0
  },
  level_status: {
    type: Number,
    default: 0
  },
  approve_status: {
    type: Number,
    default: 0
  },
  ban_number_input: {
    type: Number,

  },
  financial_supplier: {
    type: String,

  },
  status: {
    type: Boolean,
    default: true
  },
  is_ban: {
    type: Boolean,
    default: false
  },
  is_revert: {
    type: Boolean,
    default: false
  },
  is_cfo: {
    type: Boolean,
    default: false
  },
  final_approval: {
    type: Boolean,
    default: false
  },
  is_download_pdf: {
    type: Boolean,
    default: false
  },
  operator_by: {
    type: mongoose.Types.ObjectId,
    ref: "adminUSers",
    index: true
  },
  operator_type: {
    type: String,
    default: ""
  },
  remark: {
    type: String,
    default: "Register"
  },
}, {
  timestamps: true,
});

vendorSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

module.exports = mongoose.model('vendors', vendorSchema);
