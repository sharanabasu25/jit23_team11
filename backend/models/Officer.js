const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true // One user can only be linked to one Officer profile
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['Road Department', 'Electrical Department', 'Water Department'],
        message: '{VALUE} is not an allowed department.'
      }
    },
    assignedArea: {
      type: String,
      required: [true, 'Assigned Area is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    availability: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create index for department field
officerSchema.index({ department: 1 });

const Officer = mongoose.model('Officer', officerSchema);

module.exports = Officer;
