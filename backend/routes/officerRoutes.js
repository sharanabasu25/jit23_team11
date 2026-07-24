const express = require('express');
const {
  getOfficerDashboard,
  getAssignedComplaints,
  updateComplaintStatus,
  addOfficerRemarks,
  resolveComplaint,
  assignOfficer,
  getSystemStats
} = require('../controllers/officerController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to get officer dashboard stats and assigned complaints
router.get('/dashboard', protect, authorize('Officer'), getOfficerDashboard);

// Route to list officer's assigned complaints
router.get('/assigned', protect, authorize('Officer'), getAssignedComplaints);

// Route to get system-wide statistics (department, status, priority counts)
router.get('/stats', protect, authorize('Officer', 'Admin'), getSystemStats);

// Route to update status of an assigned complaint
router.patch('/complaints/:id/status', protect, authorize('Officer', 'Admin'), updateComplaintStatus);

// Route to add remarks to an assigned complaint
router.patch('/complaints/:id/remarks', protect, authorize('Officer', 'Admin'), addOfficerRemarks);

// Route to resolve an assigned complaint (uploads resolution photo)
router.patch(
  '/complaints/:id/resolve',
  protect,
  authorize('Officer', 'Admin'),
  upload.single('resolutionImage'),
  resolveComplaint
);

// Route to assign an officer to a complaint
router.patch('/complaints/:id/assign', protect, authorize('Officer', 'Admin'), assignOfficer);

module.exports = router;
