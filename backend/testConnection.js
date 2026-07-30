require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Officer = require('./models/Officer');
const Complaint = require('./models/Complaint');
const mongoose = require('mongoose');

async function runTests() {
  try {
    console.log('=====================================================');
    console.log('     SPGMS DATABASE MODULE INTEGRATION TESTS         ');
    console.log('=====================================================');

    // 1. Establish DB Connection
    console.log('\n[TEST 1] Connecting to MongoDB Atlas...');
    const conn = await connectDB();
    console.log(`[PASS] Connected to Database: ${conn.connection.name}`);

    // Clean up any stray test data from previous incomplete test runs
    await User.deleteMany({ email: { $in: ['test_citizen@spgms.org', 'test_officer@spgms.org'] } });
    console.log('Initial cleanup of test emails completed.');

    // 2. Test User Model Compiling and Creation (Citizen & Officer roles)
    console.log('\n[TEST 2] Creating Citizen and Officer Users...');
    const citizenUser = await User.create({
      fullName: 'Suresh Kumar',
      email: 'test_citizen@spgms.org',
      password: 'secure_password_123',
      phoneNumber: '+919876543210',
      role: 'Citizen'
    });
    console.log(`[PASS] Citizen User compiled & created. ID: ${citizenUser._id}`);

    const officerUser = await User.create({
      fullName: 'Officer Ramesh Patil',
      email: 'test_officer@spgms.org',
      password: 'officer_secure_456',
      phoneNumber: '+919012345678',
      role: 'Officer'
    });
    console.log(`[PASS] Officer User compiled & created. ID: ${officerUser._id}`);

    // 3. Test Officer Model Compiling and Creation
    console.log('\n[TEST 3] Creating Officer Profile...');
    const officerProfile = await Officer.create({
      user: officerUser._id,
      department: 'Road Department',
      assignedArea: 'Ward 4 - Malleshwaram',
      designation: 'Senior Road Inspector',
      availability: true
    });
    console.log(`[PASS] Officer Profile compiled & created. ID: ${officerProfile._id}`);

    // 4. Test Complaint Model and Category Auto-Mapping Hook
    console.log('\n[TEST 4] Creating Complaint & Verifying Auto-Department Mapping...');
    // Setting Category to 'Pothole'. The hook should automatically populate 'Road Department' for department.
    const complaint = await Complaint.create({
      citizen: citizenUser._id,
      complaintImageUrl: 'https://images.spgms.org/complaints/pothole1.jpg',
      manualDescription: 'Dangerous pothole at 8th cross main road in front of bank.',
      aiGeneratedDescription: 'Visual detection matching: Pothole, severity high.',
      complaintCategory: 'Pothole', // Target Category
      priority: 'High',
      latitude: 12.9983,
      longitude: 77.5714,
      address: '8th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560003',
      assignedOfficer: officerProfile._id
    });
    console.log(`[PASS] Complaint compiled & created. ID: ${complaint._id}`);
    console.log(`Auto-mapped department for category '${complaint.complaintCategory}': '${complaint.department}'`);
    
    if (complaint.department !== 'Road Department') {
      throw new Error(`Mapping failed! Expected 'Road Department', but got '${complaint.department}'`);
    }
    console.log('[PASS] Pre-validate Category-to-Department mapping verified.');

    // 5. Test Complaint Update (U in CRUD)
    console.log('\n[TEST 5] Updating Complaint Status & Remarks...');
    const updateResult = await Complaint.findByIdAndUpdate(
      complaint._id,
      {
        status: 'In Progress',
        officerRemarks: 'Inspector dispatched to investigate Malleshwaram pothole.'
      },
      { new: true } // Returns the modified document
    );
    console.log(`Updated Status: '${updateResult.status}'`);
    console.log(`Updated Remarks: '${updateResult.officerRemarks}'`);
    
    if (updateResult.status !== 'In Progress' || updateResult.officerRemarks.indexOf('dispatched') === -1) {
      throw new Error('Complaint update failed!');
    }
    console.log('[PASS] Complaint document update verified.');

    // 6. Test Schema Relationships with Populate (R in CRUD)
    console.log('\n[TEST 6] Querying and Populating Relationships...');
    const fetchedComplaint = await Complaint.findById(complaint._id)
      .populate('citizen')
      .populate({
        path: 'assignedOfficer',
        populate: {
          path: 'user'
        }
      });

    console.log(`- Fetched Complaint ID: ${fetchedComplaint._id}`);
    console.log(`- Populated Citizen: ${fetchedComplaint.citizen.fullName} (${fetchedComplaint.citizen.email})`);
    console.log(`- Populated Officer: ${fetchedComplaint.assignedOfficer.user.fullName} (${fetchedComplaint.assignedOfficer.user.email})`);
    console.log(`  Designation: ${fetchedComplaint.assignedOfficer.designation}`);
    console.log(`  Department: ${fetchedComplaint.assignedOfficer.department}`);
    console.log(`  Area: ${fetchedComplaint.assignedOfficer.assignedArea}`);
    console.log(`  Status (Post-Update): ${fetchedComplaint.status}`);
    
    if (fetchedComplaint.citizen.email !== 'test_citizen@spgms.org') {
      throw new Error('Citizen populating failed!');
    }
    if (fetchedComplaint.assignedOfficer.user.email !== 'test_officer@spgms.org') {
      throw new Error('Officer user populating failed!');
    }
    console.log('[PASS] Mongoose schema references & population verified.');

    // 7. Cleanup DB Test Documents (D in CRUD)
    console.log('\n[TEST 7] Cleaning up test data from MongoDB Atlas...');
    await Complaint.findByIdAndDelete(complaint._id);
    await Officer.findByIdAndDelete(officerProfile._id);
    await User.findByIdAndDelete(citizenUser._id);
    await User.findByIdAndDelete(officerUser._id);
    console.log('[PASS] Test cleanup complete. No stray data left.');

    console.log('\n=====================================================');
    console.log('       ALL DATABASE MODULE TESTS PASSED SUCCESS!      ');
    console.log('=====================================================');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('\n[FAIL] Test suite failed with error:');
    console.error(error);
    try {
      await mongoose.connection.close();
    } catch (e) {}
    process.exit(1);
  }
}

runTests();
