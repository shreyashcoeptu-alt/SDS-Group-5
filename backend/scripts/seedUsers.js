const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Checking existing demo users...');

    const demoUsers = [
      {
        name: 'Cafeteria Manager Admin',
        email: 'admin@cafeteria.com',
        password: 'Admin@123',
        role: 'cafeteria_admin',
        phone: '+1 (555) 019-2834',
        status: 'active',
      },
      {
        name: 'Jordan Rivera (Student)',
        email: 'customer@student.com',
        password: 'Customer@123',
        role: 'customer',
        phone: '+1 (555) 349-8812',
        status: 'active',
      },
      {
        name: 'Samantha Lee (Faculty Customer)',
        email: 'samantha.lee@campus.edu',
        password: 'Customer@123',
        role: 'customer',
        phone: '+1 (555) 782-9901',
        status: 'active',
      },
      {
        name: 'Marcus Chen (Staff Customer)',
        email: 'marcus.chen@campus.edu',
        password: 'Customer@123',
        role: 'customer',
        phone: '+1 (555) 432-1100',
        status: 'active',
      },
    ];

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`[Seed] Created demo user: ${u.email} (${u.role})`);
      } else {
        console.log(`[Seed] User already exists: ${u.email}`);
      }
    }

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedData();
