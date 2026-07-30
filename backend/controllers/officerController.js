const fs = require('fs');
const { Complaint, Officer, User } = require('../models');

/**
 * Helper to fetch officer profile associated with logged in user.
 */
const getOfficerProfile = async (userId) => {
  const profile = await Officer.findOne({ user: userId });
  if (!profile) {
    throw new Error('Officer profile not found. Please create an officer profile for this user.');
  }
  return profile;
};

/**
 * @desc    Get Officer Dashboard stats and assigned complaints list
 * @route   GET /api/officers/dashboard
 * @access  Private (Officer only)
 */
const getOfficerDashboard = async (req, res, next) => {
  try {
    const officer = await getOfficerProfile(req.user._id);

    // 1. Fetch complaints assigned to this officer
    const complaints = await Complaint.find({ assignedOfficer: officer._id })
      .sort({ updatedAt: -1 })
      .populate('citizen', 'fullName email phoneNumber');

    // 2. Aggregate status and priority statistics
    const stats = {
      totalAssigned: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      seen: complaints.filter(c => c.status === 'Seen').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      priorityHigh: complaints.filter(c => c.priority === 'High').length,
      priorityMedium: complaints.filter(c => c.priority === 'Medium').length,
      priorityLow: complaints.filter(c => c.priority === 'Low').length
    };

    res.json({
      officer,
      stats,
      complaints
    });

  } catch (error) {
    console.error(`[Officer Dashboard] Error: ${error.message}`);
    res.status(error.message.includes('not found') ? 404 : 500);
    return next(error);
  }
};

/**
 * @desc    Get complaints assigned to the officer
 * @route   GET /api/officers/assigned
 * @access  Private (Officer only)
 */
const getAssignedComplaints = async (req, res, next) => {
  try {
    const officer = await getOfficerProfile(req.user._id);
    const complaints = await Complaint.find({ assignedOfficer: officer._id })
      .sort({ createdAt: -1 })
      .populate('citizen', 'fullName email phoneNumber');

    res.json(complaints);
  } catch (error) {
    console.error(`[Officer Assigned] Error: ${error.message}`);
    res.status(error.message.includes('not found') ? 404 : 500);
    return next(error);
  }
};

/**
 * @desc    Update complaint status
 * @route   PATCH /api/officers/complaints/:id/status
 * @access  Private (Officer/Admin only)
 */
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Pending', 'Seen', 'In Progress', 'Resolved'].includes(status)) {
      res.status(400);
      return next(new Error('Please provide a valid status: Pending, Seen, In Progress, Resolved.'));
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      return next(new Error('Complaint not found.'));
    }

    // Verify assignment if user is an Officer
    if (req.user.role === 'Officer') {
      const officer = await getOfficerProfile(req.user._id);
      if (!complaint.assignedOfficer || complaint.assignedOfficer.toString() !== officer._id.toString()) {
        res.status(403);
        return next(new Error('Access Denied - You can only update status of complaints assigned to you.'));
      }
    }

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    console.error(`[Officer Status Update] Error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Add officer remarks to a complaint
 * @route   PATCH /api/officers/complaints/:id/remarks
 * @access  Private (Officer/Admin only)
 */
const addOfficerRemarks = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    
    if (remarks === undefined) {
      res.status(400);
      return next(new Error('Please provide remarks field.'));
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      return next(new Error('Complaint not found.'));
    }

    // Verify assignment if user is an Officer
    if (req.user.role === 'Officer') {
      const officer = await getOfficerProfile(req.user._id);
      if (!complaint.assignedOfficer || complaint.assignedOfficer.toString() !== officer._id.toString()) {
        res.status(403);
        return next(new Error('Access Denied - You can only edit remarks of complaints assigned to you.'));
      }
    }

    complaint.officerRemarks = remarks.trim();
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    console.error(`[Officer Remarks Update] Error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Resolve a complaint with image and remarks
 * @route   PATCH /api/officers/complaints/:id/resolve
 * @access  Private (Officer/Admin only)
 */
const resolveComplaint = async (req, res, next) => {
  try {
    const { remarks } = req.body;

    if (!req.file) {
      res.status(400);
      return next(new Error('Resolution image file is required to resolve a complaint.'));
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(404);
      return next(new Error('Complaint not found.'));
    }

    // Verify assignment if user is an Officer
    if (req.user.role === 'Officer') {
      const officer = await getOfficerProfile(req.user._id);
      if (!complaint.assignedOfficer || complaint.assignedOfficer.toString() !== officer._id.toString()) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(403);
        return next(new Error('Access Denied - You can only resolve complaints assigned to you.'));
      }
    }

    // Update complaint state
    complaint.status = 'Resolved';
    complaint.resolutionImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    if (remarks) {
      complaint.officerRemarks = remarks.trim();
    }

    await complaint.save();
    res.json(complaint);

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error(`[Officer Resolve] Error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Assign an officer to a complaint
 * @route   PATCH /api/officers/complaints/:id/assign
 * @access  Private (Officer/Admin only)
 */
const assignOfficer = async (req, res, next) => {
  try {
    const { officerId } = req.body;

    if (!officerId) {
      res.status(400);
      return next(new Error('Please provide officerId.'));
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      return next(new Error('Complaint not found.'));
    }

    const officer = await Officer.findById(officerId);
    if (!officer) {
      res.status(404);
      return next(new Error('Officer profile not found.'));
    }

    // Update assignment and set status to Seen
    complaint.assignedOfficer = officer._id;
    if (complaint.status === 'Pending') {
      complaint.status = 'Seen';
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error(`[Officer Assignment] Error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Get system-wide statistics (counts by department, priority, and status)
 * @route   GET /api/officers/stats
 * @access  Private (Officer/Admin only)
 */
const getSystemStats = async (req, res, next) => {
  try {
    // 1. Status aggregates
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 2. Department aggregates
    const departmentCounts = await Complaint.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // 3. Priority aggregates
    const priorityCounts = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Format outputs cleanly
    const stats = {
      byStatus: statusCounts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), { Pending: 0, Seen: 0, 'In Progress': 0, Resolved: 0 }),
      byDepartment: departmentCounts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), { 'Road Department': 0, 'Electrical Department': 0, 'Water Department': 0 }),
      byPriority: priorityCounts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), { High: 0, Medium: 0, Low: 0 })
    };

    res.json(stats);

  } catch (error) {
    console.error(`[System Stats] Error: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  getOfficerDashboard,
  getAssignedComplaints,
  updateComplaintStatus,
  addOfficerRemarks,
  resolveComplaint,
  assignOfficer,
  getSystemStats
};
