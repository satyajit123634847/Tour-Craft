const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true
  },
  username: {
    type: String,
    required: true,
    // unique: true
  },
  sign: {
    type: String,
  },
  mobile_number: {
    type: Number,
    required: true,
    // unique: true
  },
  email: {
    type: String,
    required: true,
    // unique: true
  },
  password: {
    type: String,
    required: true
  },
  app_password: {
    type: String,
    default:null
    
  },
  user_status: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default:true
  }
});

adminSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

adminSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (!update.password) {
    // if password is not updated, just move to next middleware
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  update.password = await bcrypt.hash(update.password, salt);
  next();
});

adminSchema.pre('findByIdAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (!update.password) {
    // if password is not updated, just move to next middleware
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  update.password = await bcrypt.hash(update.password, salt);
  next();
});

module.exports = mongoose.model('adminUSers', adminSchema);
