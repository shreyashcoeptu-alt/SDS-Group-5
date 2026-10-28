// ==============================================================================
// FILE: backend/utils/seed.js
// STUDENT: Shreyash (Student 2 - Menu & Food Management)
// PURPOSE: Seeds MongoDB with dummy menu items priced at 1 Rupee only
// RUN WITH: npm run seed (from inside backend/ folder)
// ==============================================================================

// dotenv loads values from our .env file into process.env (like MONGO_URI)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Mongoose connects us to MongoDB
const mongoose = require('mongoose');

// Import our MenuItem model to insert data into the database
const MenuItem = require('../models/MenuItem');
/**
 * DUMMY MENU DATA
 * Sourced directly from frontend dummyMenu.js!
 * Note: All prices are strictly set to 1 Rupee as requested.
 * Each item has defined subparts: name, price, category, tags, description, image, isVeg, isAvailable.
 */
const DUMMY_MENU_ITEMS = [
  {
    name: 'Samosa',
    category: 'Snacks',
    price: 1, // 1 Rupee only!
    tags: ['Crispy', 'Spicy', 'Popular'],
    description: 'Crispy pastry stuffed with spiced potato and peas.',
    image: '/images/menu/samosa.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Vada pav',
    category: 'Snacks',
    price: 1, // 1 Rupee only!
    tags: ['Mumbai Special', 'Street Food'],
    description: 'Spiced potato fritter in a soft pav with chutney.',
    image: '/images/menu/vadapav.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Sabji roti',
    category: 'Meals',
    price: 1, // 1 Rupee only!
    tags: ['Healthy', 'Home Style', 'Wholesome'],
    description: 'Seasonal vegetable curry with two rotis.',
    image: '/images/menu/sabjiroti.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Masala dosa',
    category: 'Breakfast',
    price: 1, // 1 Rupee only!
    tags: ['South Indian', 'Crispy', 'Sambar'],
    description: 'Crisp rice crepe filled with spiced potato.',
    image: '/images/menu/dosa.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Chinese rice',
    category: 'Meals',
    price: 1, // 1 Rupee only!
    tags: ['Chinese', 'Wok Fried', 'Quick Bite'],
    description: 'Veg fried rice tossed with soy sauce and vegetables.',
    image: '/images/menu/friedrice.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Veg manchurian',
    category: 'Snacks',
    price: 1, // 1 Rupee only!
    tags: ['Chinese', 'Tangy', 'Hot Gravy'],
    description: 'Fried vegetable balls in a tangy soy gravy.',
    image: '/images/menu/manchurian.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Pav bhaji',
    category: 'Meals',
    price: 1, // 1 Rupee only!
    tags: ['Butter Rich', 'Street Food', 'Spicy'],
    description: 'Buttery mashed vegetable curry with toasted pav.',
    image: '/images/menu/pavbhaji.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Idli sambar',
    category: 'Breakfast',
    price: 1, // 1 Rupee only!
    tags: ['South Indian', 'Steamed', 'Light'],
    description: 'Steamed rice cakes with sambar and chutney.',
    image: '/images/menu/idli.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Poha',
    category: 'Breakfast',
    price: 1, // 1 Rupee only!
    tags: ['Light', 'Peanuts', 'Quick Snack'],
    description: 'Flattened rice with onion, peanuts and lemon.',
    image: '/images/menu/poha.jpeg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Chole bhature',
    category: 'Meals',
    price: 1, // 1 Rupee only!
    tags: ['North Indian', 'Fluffy', 'Rich Gravy'],
    description: 'Spiced chickpeas with fluffy fried bread.',
    image: '/images/menu/cholebhature.jpg',
    isVeg: true,
    isAvailable: true,
  },
  {
    name: 'Egg roll',
    category: 'Snacks',
    price: 1, // 1 Rupee only!
    tags: ['Non-Veg', 'High Protein', 'Kathi Roll'],
    description: 'Paratha rolled around a spiced egg omelette.',
    image: '/images/menu/eggroll.jpeg',
    isVeg: false,
    isAvailable: true,
  },
  {
    name: 'Chicken fried rice',
    category: 'Meals',
    price: 1, // 1 Rupee only!
    tags: ['Non-Veg', 'Chicken', 'Chinese'],
    description: 'Wok-fried rice with chicken and vegetables.',
    image: '/images/menu/chickenrice.jpg',
    isVeg: false,
    isAvailable: false, // Testing sold-out / unavailable handling
  },
];

/**
 * Seeder Function:
 * 1. Connects to MongoDB
 * 2. Clears old menu records (so we don't have duplicate items)
 * 3. Inserts all 12 dummy menu items
 * 4. Disconnects cleanly
 */
const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cafeteria_db';
    console.log(`📡 Connecting to MongoDB at: ${mongoUri}...`);
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connected!');

    // Step 2: Delete existing menu items to start fresh
    console.log('🧹 Clearing previous menu items from collection...');
    await MenuItem.deleteMany({});

    // Step 3: Insert the new 12 dishes
    console.log(`🌱 Seeding ${DUMMY_MENU_ITEMS.length} dummy menu items with price = ₹1...`);
    const insertedItems = await MenuItem.insertMany(DUMMY_MENU_ITEMS);

    console.log(`✓ Successfully seeded ${insertedItems.length} dishes into MongoDB!`);
    console.log('Example dish seeded:', insertedItems[0].name, '— Price:', `₹${insertedItems[0].price}`);

    // Exit process with 0 (indicates clean success)
    process.exit(0);
  } catch (error) {
    console.error(`✗ Seeding failed with error: ${error.message}`);
    // Exit process with 1 (indicates error)
    process.exit(1);
  }
};

// Execute the seeder function
seedDatabase();
