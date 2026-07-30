const express = require('express');
const { 
  createComplaint, 
  getComplaintById, 
  getCitizenHistory, 
  getComplaints 
} = require('../controllers/complaintController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to submit a new complaint (restricted to Citizens only)
// Multer parses single file field named 'image'
router.post(
  '/', 
  protect, 
  authorize('Citizen'), 
  upload.single('image'), 
  createComplaint
);

// Route to get all complaints with query filters (requires login)
router.get('/', protect, getComplaints);

// Route to get logged-in citizen's complaint history
router.get('/history', protect, authorize('Citizen'), getCitizenHistory);

// Route to fetch details of a single complaint
router.get('/:id', protect, getComplaintById);

module.exports = router;
