// ==============================================================================
// FILE: backend/utils/seed.js
// STUDENT: Shreyash (Student 2 - Menu & Food Management)
// PURPOSE: Seeds MongoDB with realistic student stall prices (all <= Rs 150)
// RUN WITH: npm run seed (from inside backend/ folder)
// ==============================================================================

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

const SEED_USERS = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.cs23@college.edu',
    studentId: 'CS23-0104',
    batch: '2023-27',
    department: 'Computer Science',
    password: 'lunchroom2026',
    role: 'customer',
    phone: '9876543210',
    status: 'active',
  },
  {
    name: 'Cafeteria Admin',
    email: 'admin@cafeteria.com',
    studentId: 'ADMIN-001',
    password: 'Admin@123',
    role: 'cafeteria_admin',
    phone: '9890001122',
    status: 'active',
  },
];

/**
 * 12 Canonical Lunchroom Menu Items
 * Realistic, student-friendly college cafeteria / local food stall prices:
 * All prices strictly below 150 Rs!
 */
const DUMMY_MENU_ITEMS = [
  {
    name: 'Samosa',
    category: 'Snacks',
    price: 15,
    tags: ['Crispy', 'Spicy', 'Popular'],
    description: 'Crispy pastry stuffed with spiced potato and peas.',
    image: '/images/menu/samosa.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Vada pav',
    category: 'Snacks',
    price: 20,
    tags: ['Mumbai Special', 'Street Food'],
    description: 'Spiced potato fritter in a soft pav with chutney.',
    image: '/images/menu/vadapav.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Sabji roti',
    category: 'Meals',
    price: 50,
    tags: ['Healthy', 'Home Style', 'Wholesome'],
    description: 'Seasonal vegetable curry with two rotis.',
    image: '/images/menu/sabjiroti.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Masala dosa',
    category: 'Breakfast',
    price: 60,
    tags: ['South Indian', 'Crispy', 'Sambar'],
    description: 'Crisp rice crepe filled with spiced potato.',
    image: '/images/menu/dosa.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Chinese rice',
    category: 'Meals',
    price: 70,
    tags: ['Chinese', 'Wok Fried', 'Quick Bite'],
    description: 'Veg fried rice tossed with soy sauce and vegetables.',
    image: '/images/menu/friedrice.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Veg manchurian',
    category: 'Snacks',
    price: 65,
    tags: ['Chinese', 'Spicy', 'Appetizer'],
    description: 'Fried vegetable balls in a tangy soy gravy.',
    image: '/images/menu/manchurian.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Pav bhaji',
    category: 'Snacks',
    price: 70,
    tags: ['Mumbai Special', 'Butter', 'Street Food'],
    description: 'Buttery mashed vegetable curry with toasted pav.',
    image: '/images/menu/pavbhaji.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Idli sambar',
    category: 'Breakfast',
    price: 40,
    tags: ['South Indian', 'Steamed', 'Healthy'],
    description: 'Steamed rice cakes with sambar and chutney.',
    image: '/images/menu/idli.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Poha',
    category: 'Breakfast',
    price: 25,
    tags: ['Light', 'Quick Snack', 'Breakfast'],
    description: 'Flattened rice with onion, peanuts and lemon.',
    image: '/images/menu/poha.jpeg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Chole bhature',
    category: 'Meals',
    price: 75,
    tags: ['North Indian', 'Hearty', 'Popular'],
    description: 'Spiced chickpeas with fluffy fried bread.',
    image: '/images/menu/cholebhature.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Egg roll',
    category: 'Snacks',
    price: 50,
    tags: ['Non-Veg', 'High Protein', 'Kolkata Style'],
    description: 'Paratha rolled around a spiced egg omelette.',
    image: '/images/menu/eggroll.jpeg',
    isVeg: false,
    isAvailable: true,
  },
  {
    name: 'Chicken fried rice',
    category: 'Meals',
    price: 110,
    tags: ['Non-Veg', 'Chicken', 'Chinese'],
    description: 'Wok-fried rice with chicken and vegetables.',
    image: '/images/menu/chickenrice.jpg',
    isVeg: false,
    isAvailable: true,
  },
];

/**
 * Ensures demo users and all menu items exist with up-to-date prices and images
 */
const ensureDemoSeed = async () => {
  try {
    for (const u of SEED_USERS) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create(u);
        console.log(`✓ Created demo user: ${u.email} (${u.role})`);
      }
    }
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      await MenuItem.insertMany(DUMMY_MENU_ITEMS);
      console.log('✓ Seeded initial 12 menu items into MongoDB!');
    } else {
      for (const item of DUMMY_MENU_ITEMS) {
        await MenuItem.updateOne(
          { name: item.name },
          {
            $set: {
              price: item.price,
              category: item.category,
              description: item.description,
              image: item.image,
              isVeg: item.isVeg,
              isAvailable: item.isAvailable,
              tags: item.tags,
            },
          },
          { upsert: true }
        );
      }
    }
  } catch (err) {
    console.error('Demo seed check error:', err.message);
  }
};

const autoSeed = async () => {
  try {
    await User.deleteMany({ email: { $in: ['aarav.cs23@college.edu', 'admin@cafeteria.com'] } });
    for (const u of SEED_USERS) {
      await User.create(u);
    }
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(DUMMY_MENU_ITEMS);
    console.log('✓ Seeded 12 menu items with real student stall prices into MongoDB!');
  } catch (err) {
    console.error('Auto-seed warning:', err.message);
  }
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/TheLunchroom';
    console.log(`📡 Connecting to MongoDB at: ${mongoUri}...`);
    
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connected!');

    await autoSeed();
    console.log(`✓ Database successfully seeded with real prices!`);

    process.exit(0);
  } catch (error) {
    console.error(`✗ Seeding failed with error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  ensureDemoSeed,
  autoSeed,
  seedDatabase,
  DUMMY_MENU_ITEMS,
  SEED_USERS,
};

if (require.main === module) {
  seedDatabase();
}
