const fs = require('fs');
const { Complaint } = require('../models');
const { detectGrievance } = require('../services/aiService');

const ALLOWED_CATEGORIES = ['Pothole', 'Electricity Problem', 'Water Leakage'];

/**
 * Normalizes and maps category names to official schema enums.
 */
const mapCategory = (categoryStr) => {
  if (!categoryStr) return null;
  const normalized = categoryStr.trim().toLowerCase();
  
  if (normalized === 'pothole') return 'Pothole';
  if (normalized === 'electricity problem' || normalized === 'electricity') return 'Electricity Problem';
  if (normalized === 'water leakage' || normalized === 'water') return 'Water Leakage';
  
  return null;
};

/**
 * @desc    Create a new Complaint (AI-assisted or manual fallback)
 * @route   POST /api/complaints
 * @access  Private (Citizen only)
 */
const createComplaint = async (req, res, next) => {
  try {
    const { manualDescription, latitude, longitude, address } = req.body;

    // 1. Check if image file is uploaded
    if (!req.file) {
      res.status(400);
      return next(new Error('Complaint image file is required.'));
    }

    // 2. Validate basic input fields
    if (!manualDescription || !latitude || !longitude || !address) {
      // Remove uploaded file if validation fails
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(400);
      return next(new Error('Please provide manualDescription, latitude, longitude, and address.'));
    }

    // Validate coordinates
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(400);
      return next(new Error('Latitude and Longitude must be valid numbers.'));
    }

    // 3. Send image to FastAPI service for visual prediction
    const aiResult = await detectGrievance(req.file.path);

    // 4. Determine and validate complaint category
    let category = mapCategory(aiResult.class_name);
    
    // Fallback to manual category input if AI classification doesn't match allowed scope
    if (!category && req.body.complaintCategory) {
      category = mapCategory(req.body.complaintCategory);
    }

    // Reject request if category is not within permitted scope
    if (!category) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(400);
      return next(
        new Error(
          `Rejected - Category not supported. Only ${ALLOWED_CATEGORIES.join(', ')} complaints are accepted.`
        )
      );
    }

    // 5. Determine priority (uses body input if valid, else maps from AI confidence)
    let priority = 'Medium';
    if (req.body.priority && ['High', 'Medium', 'Low'].includes(req.body.priority)) {
      priority = req.body.priority;
    } else if (aiResult.success && aiResult.confidence) {
      if (aiResult.confidence > 0.75) priority = 'High';
      else if (aiResult.confidence > 0.4) priority = 'Medium';
      else priority = 'Low';
    }

    // 6. Construct complaint image static access URL
    const complaintImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // 7. Save Complaint to MongoDB
    // Note: Schema pre-validate hook will automatically map the department based on category
    const complaint = await Complaint.create({
      citizen: req.user._id,
      complaintImageUrl,
      manualDescription,
      aiGeneratedDescription: aiResult.message || `AI classified: ${aiResult.class_name}`,
      complaintCategory: category,
      priority,
      status: 'Pending',
      latitude: lat,
      longitude: lng,
      address
    });

    res.status(201).json(complaint);

  } catch (error) {
    // Delete file if error occurs during process to save disk space
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error(`[Complaints] Create error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Get Complaint details by ID
 * @route   GET /api/complaints/:id
 * @access  Private (All authenticated roles)
 */
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'fullName email phoneNumber')
      .populate({
        path: 'assignedOfficer',
        populate: {
          path: 'user',
          select: 'fullName email phoneNumber'
        }
      });

    if (!complaint) {
      res.status(404);
      return next(new Error('Complaint not found.'));
    }

    res.json(complaint);
  } catch (error) {
    console.error(`[Complaints] Fetch ID error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Get complaint history for the logged-in citizen
 * @route   GET /api/complaints/history
 * @access  Private (Citizen only)
 */
const getCitizenHistory = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user._id })
      .sort({ createdAt: -1 })
      .populate('citizen', 'fullName email phoneNumber')
      .populate({
        path: 'assignedOfficer',
        populate: {
          path: 'user',
          select: 'fullName email phoneNumber'
        }
      });

    res.json(complaints);
  } catch (error) {
    console.error(`[Complaints] History error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Get complaints with sorting and filtering options
 * @route   GET /api/complaints
 * @access  Private (All authenticated roles)
 */
const getComplaints = async (req, res, next) => {
  try {
    const { status, priority, department, area } = req.query;
    const query = {};

    // Apply exact match filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (department) query.department = department;

    // Apply regex search on address/area
    if (area) {
      query.address = { $regex: area, $options: 'i' };
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate('citizen', 'fullName email phoneNumber')
      .populate({
        path: 'assignedOfficer',
        populate: {
          path: 'user',
          select: 'fullName email phoneNumber'
        }
      });

    res.json(complaints);
  } catch (error) {
    console.error(`[Complaints] Query filter error: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaintById,
  getCitizenHistory,
  getComplaints
};
