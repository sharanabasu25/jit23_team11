const bcrypt = require('bcryptjs');
const { User, Officer, Complaint } = require('../models');

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Database Seeder] Database already contains ${userCount} users. Skipping seeding.`);
      return;
    }

    console.log('[Database Seeder] Seeding initial users and complaints...');

    const salt = await bcrypt.genSalt(10);
    const citizenPass = await bcrypt.hash('citizen123', salt);
    const officerPass = await bcrypt.hash('officer123', salt);
    const testCitizenPass = await bcrypt.hash('secure_password_123', salt);
    const testOfficerPass = await bcrypt.hash('officer_secure_456', salt);

    // 1. Create Citizens
    const citizen1 = await User.create({
      fullName: 'Suresh Kumar',
      email: 'citizen@spgms.org',
      password: citizenPass,
      phoneNumber: '+919876543210',
      role: 'Citizen'
    });

    await User.create({
      fullName: 'Test Citizen',
      email: 'test_citizen@spgms.org',
      password: testCitizenPass,
      phoneNumber: '+919876543211',
      role: 'Citizen'
    });

    // 2. Create Officers
    const officer1 = await User.create({
      fullName: 'Officer Ramesh Patil',
      email: 'officer@spgms.org',
      password: officerPass,
      phoneNumber: '+919012345678',
      role: 'Officer'
    });

    const officerProfile1 = await Officer.create({
      user: officer1._id,
      department: 'Road Department',
      assignedArea: 'Ward 4 - Malleshwaram',
      designation: 'Senior Road Inspector',
      availability: true
    });

    const officer2 = await User.create({
      fullName: 'Officer Sunita Rao',
      email: 'test_officer@spgms.org',
      password: testOfficerPass,
      phoneNumber: '+919123456789',
      role: 'Officer'
    });

    const officerProfile2 = await Officer.create({
      user: officer2._id,
      department: 'Electrical Department',
      assignedArea: 'Ward 7 - Indiranagar',
      designation: 'Chief Electrical Engineer',
      availability: true
    });

    // 3. Create initial complaints
    await Complaint.create([
      {
        citizen: citizen1._id,
        complaintImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
        manualDescription: 'Severe deep pothole near Malleshwaram 8th Cross circle causing traffic hazards and minor vehicle damage.',
        aiGeneratedDescription: 'AI Detection: Pothole detected with 94.2% confidence. Priority: High.',
        complaintCategory: 'Pothole',
        department: 'Road Department',
        priority: 'High',
        status: 'In Progress',
        latitude: 12.9983,
        longitude: 77.5714,
        address: '8th Cross Road, Malleshwaram, Bengaluru, Karnataka 560003',
        assignedOfficer: officerProfile1._id,
        officerRemarks: 'Inspection team dispatched. Repair crew scheduled for asphalt filling.'
      },
      {
        citizen: citizen1._id,
        complaintImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60',
        manualDescription: 'Exposed live power cable dangling from utility pole on 100ft road near bus stop.',
        aiGeneratedDescription: 'AI Detection: Electricity Problem detected with 91.5% confidence. Priority: High.',
        complaintCategory: 'Electricity Problem',
        department: 'Electrical Department',
        priority: 'High',
        status: 'Pending',
        latitude: 12.9784,
        longitude: 77.6408,
        address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
        assignedOfficer: officerProfile2._id,
        officerRemarks: ''
      },
      {
        citizen: citizen1._id,
        complaintImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=60',
        manualDescription: 'Main water supply pipeline rupture leaking drinking water onto public sidewalk.',
        aiGeneratedDescription: 'AI Detection: Water Leakage detected with 93.0% confidence. Priority: Medium.',
        complaintCategory: 'Water Leakage',
        department: 'Water Department',
        priority: 'Medium',
        status: 'Resolved',
        latitude: 12.9352,
        longitude: 77.6245,
        address: '5th Block, Koramangala, Bengaluru, Karnataka 560095',
        officerRemarks: 'Maintenance crew repaired the pipeline joint and restored sidewalk surface.'
      }
    ]);

    console.log('[Database Seeder] Default users & complaints seeded successfully!');
    console.log('  -> Citizen: citizen@spgms.org / citizen123 (or test_citizen@spgms.org / secure_password_123)');
    console.log('  -> Officer: officer@spgms.org / officer123 (or test_officer@spgms.org / officer_secure_456)');
  } catch (err) {
    console.error('[Database Seeder] Seeding error:', err.message);
  }
};

module.exports = seedInitialData;
