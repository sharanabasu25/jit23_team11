const mongoose = require('mongoose');

const departmentMapping = {
  'Pothole': 'Road Department',
  'Electricity Problem': 'Electrical Department',
  'Water Leakage': 'Water Department'
};

const complaintSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Citizen reference is required']
    },
    complaintImageUrl: {
      type: String,
      required: [true, 'Complaint Image URL is required']
    },
    manualDescription: {
      type: String,
      required: [true, 'Manual Description is required'],
      trim: true
    },
    aiGeneratedDescription: {
      type: String,
      default: "",
      trim: true
    },
    complaintCategory: {
      type: String,
      required: [true, 'Complaint Category is required'],
      enum: {
        values: ['Pothole', 'Electricity Problem', 'Water Leakage'],
        message: '{VALUE} is not an allowed complaint category (Pothole, Electricity Problem, Water Leakage).'
      }
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['Road Department', 'Electrical Department', 'Water Department'],
        message: '{VALUE} is not an allowed department.'
      }
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['High', 'Medium', 'Low'],
        message: '{VALUE} is not an allowed priority (High, Medium, Low).'
      },
      default: 'Medium'
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Pending', 'Seen', 'In Progress', 'Resolved'],
        message: '{VALUE} is not an allowed status (Pending, Seen, In Progress, Resolved).'
      },
      default: 'Pending'
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Officer',
      default: null
    },
    resolutionImage: {
      type: String,
      default: null
    },
    officerRemarks: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true // This creates createdAt (Created Time) and updatedAt (Updated Time) automatically
  }
);

// Pre-validate middleware to automatically map complaint category to department
complaintSchema.pre('validate', function(next) {
  if (this.complaintCategory) {
    const mappedDept = departmentMapping[this.complaintCategory];
    if (mappedDept) {
      this.department = mappedDept;
    }
  }
  next();
});

// Indexes to optimize querying performance
complaintSchema.index({ citizen: 1 });
complaintSchema.index({ complaintCategory: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ assignedOfficer: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
