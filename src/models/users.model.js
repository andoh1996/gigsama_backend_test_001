/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: ['Please input your firstname', true],
  },

  lastName: {
    type: String,
    required: ['Please input your last name', true],
  },

  email: {
    type: String,
    required: ['Please input email', true],
    lowercase: true,
    unique: ['Email address already exist', true],
    validate: [validator.isEmail, 'Please provide correct email'],
  },

  userID: {
    type: String,
    require: true,
    unique: true
  },

  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },

  verifiedUser: {
    type: Boolean,
    default: true,
  },

  haveDoctor: {
    type: Boolean,
    default: false,
  },

  doctorID: {
    type: String,
     default: '',
  },

  loginAttempts: { 
    type: Number,  
    default: 0 
  },

  lockUntil: { 
    type: Number, 
    default: 1 
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
});

// Virtual property to check if the user account is currently locked
userSchema.virtual('isLocked').get(function () {
  // If lockUntil exists and is in the future, the account is locked
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to increment login attempts and handle account lock logic
userSchema.methods.incrementLoginAttempts = async function () {

  // If login attempts are greater than or equal to 3, lock the account for 5  minutes
  if (this.loginAttempts >= 3) {
    await this.updateOne({
      $set: { lockUntil: Date.now() + (5 * 60 * 1000), loginAttempts: 0 }, 
    });
    return;
  }

  // Increment the login attempts if account is not locked
  await this.updateOne({
    $inc: { loginAttempts: 1 },
  });
};

// Reset login attempts on successful login
userSchema.methods.resetPasswordAttempt = async function () {
  await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });

}

/////
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});



const User = mongoose.model('Users', userSchema);

module.exports = User;
