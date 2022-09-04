//importing mongoose
const mongoose = require('mongoose');

//importing validator for validating mails
const validator = require('validator');

//importing bcryptjs for decrypting the password
const bcrypt = require('bcryptjs');

//importing jwt token for generating token
const jwt = require('jsonwebtoken');

//importing crypto
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Name cannot exceed 30 character'],
    minlength: [4, 'name should have more than 4 character'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [8, 'Password should be greater than 8 characters'],
    select: false,
  },

  //profile pic
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//used for converting the password to hash
userSchema.pre('save', async function (next) {
  //to prevent bcrypt to hash the password which is already converted into hash
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
//providing unique token to each user
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hashing and adding resetPasswordToken to userSchema
  //sha256 is an algorithm
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

//exporting UserModel
module.exports = mongoose.model('User', userSchema);
