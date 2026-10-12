const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Officer } = require('./models');
const connectDB = require('./config/db');

const seedUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Password123!', salt);

    const usersToSeed = [
      {
        fullName: 'Suresh Kumar (Citizen)',
        email: 'citizen@spgms.org',
        password: defaultPassword,
        phoneNumber: '9876543210',
        role: 'Citizen'
      },
      {
        fullName: 'Officer Ramesh Patil (Roads)',
        email: 'road.officer@spgms.org',
        password: defaultPassword,
        phoneNumber: '9876543211',
        role: 'Officer',
        officerData: {
          department: 'Road Department',
          assignedArea: 'Ward 4 - Malleshwaram',
          designation: 'Senior Road Inspector'
        }
      },
      {
        fullName: 'Officer Priya Sharma (Electricity)',
        email: 'electricity.officer@spgms.org',
        password: defaultPassword,
        phoneNumber: '9876543212',
        role: 'Officer',
        officerData: {
          department: 'Electrical Department',
          assignedArea: 'Ward 12 - Indiranagar',
          designation: 'Electrical Operations Officer'
        }
      },
      {
        fullName: 'Officer Anand Rao (Water Supply)',
        email: 'water.officer@spgms.org',
        password: defaultPassword,
        phoneNumber: '9876543213',
        role: 'Officer',
        officerData: {
          department: 'Water Department',
          assignedArea: 'Ward 7 - Jayanagar',
          designation: 'Water Supply Inspector'
        }
      }
    ];

    for (const item of usersToSeed) {
      const existingUser = await User.findOne({ email: item.email.toLowerCase() });
      if (!existingUser) {
        const newUser = await User.create({
          fullName: item.fullName,
          email: item.email.toLowerCase(),
          password: item.password,
          phoneNumber: item.phoneNumber,
          role: item.role
        });

        if (item.role === 'Officer' && item.officerData) {
          await Officer.create({
            user: newUser._id,
            department: item.officerData.department,
            assignedArea: item.officerData.assignedArea,
            designation: item.officerData.designation,
            availability: true
          });
        }
        console.log(`[Seeder] Created ${item.role}: ${item.email}`);
      }
    }

    console.log('[Seeder] Default accounts verified/seeded successfully.');
  } catch (error) {
    console.error(`[Seeder] Error: ${error.message}`);
  }
};

if (require.main === module) {
  connectDB().then(async () => {
    await seedUsers();
    process.exit(0);
  });
}

module.exports = seedUsers;

