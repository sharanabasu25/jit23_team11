const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['Citizen', 'Officer', 'Admin'],
        message: '{VALUE} is not an allowed role (Citizen, Officer, Admin).'
      }
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

// Automatically creates unique index via unique: true
const User = mongoose.model('User', userSchema);

module.exports = User;
