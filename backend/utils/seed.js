// ==============================================================================
// FILE: backend/utils/seed.js
// PURPOSE: Seeds MongoDB with real cafeteria menu items and pricing
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

const DUMMY_MENU_ITEMS = [
  // Breakfast
  {
    name: "Masala Dosa with Chutneys & Sambar",
    category: "Breakfast",
    price: 65,
    tags: ["South Indian", "Crispy", "Breakfast"],
    description: "Crispy golden fermented crepe filled with spiced potato masala, served with coconut chutney and piping hot drumstick sambar.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Steamed Idli Sambar (2 Pcs)",
    category: "Breakfast",
    price: 45,
    tags: ["South Indian", "Steamed", "Healthy"],
    description: "Fluffy melt-in-mouth rice cakes tempered with mustard and curry leaves, accompanied by fresh tomato & mint chutney.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Poha with Roasted Peanuts & Sev",
    category: "Breakfast",
    price: 35,
    tags: ["Light", "Quick Snack", "Breakfast"],
    description: "Light flattened rice seasoned with turmeric, green chillies, caramelized onions and crunchy peanuts, topped with Ratlami sev.",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Egg Bhurji Pav (Double Egg)",
    category: "Breakfast",
    price: 55,
    tags: ["Non-Veg", "High Protein", "Breakfast"],
    description: "Desi style scrambled eggs tossed with fresh tomatoes, coriander, green chillies and garam masala, served with butter-toasted pav.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: true,
  },

  // Meals
  {
    name: "North Indian Mini Thali",
    category: "Meals",
    price: 110,
    tags: ["Wholesome", "Meals", "North Indian"],
    description: "Comforting platter with Dal Makhani, Paneer Butter Masala, steamed Basmati rice, 2 whole wheat rotis, fresh salad and pickle.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Hyderabadi Chicken Dum Biryani",
    category: "Meals",
    price: 160,
    tags: ["Non-Veg", "Biryani", "Special"],
    description: "Fragrant long-grain basmati rice cooked on dum with marinated tender chicken pieces, saffron, whole spices and mirchi ka salan.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: true,
  },
  {
    name: "Paneer Biryani with Burani Raita",
    category: "Meals",
    price: 135,
    tags: ["Paneer", "Biryani", "Meals"],
    description: "Layered aromatic basmati rice with golden grilled paneer cubes, mint, browned onions and cooling garlic yoghurt raita.",
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: false,
  },
  {
    name: "Rajma Chawal Bowl",
    category: "Meals",
    price: 85,
    tags: ["Comfort Food", "Meals", "North Indian"],
    description: "Slow-cooked Kashmiri red kidney beans in a spiced onion-tomato gravy layered over steamed jeera rice with sliced onions.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Butter Chicken with 2 Garlic Naans",
    category: "Meals",
    price: 175,
    tags: ["Non-Veg", "Rich Gravy", "Special"],
    description: "Tandoori chicken chunks simmered in a velvety buttery tomato gravy enriched with kasuri methi and fresh cream.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: true,
  },

  // Snacks
  {
    name: "Mumbai Vada Pav (Plate of 2)",
    category: "Snacks",
    price: 40,
    tags: ["Mumbai Special", "Street Food", "Snacks"],
    description: "Golden spiced batata vada inside warm pav smeared with spicy garlic chutney, sweet tamarind and fiery green chilli paste.",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Crispy Samosa Chaat",
    category: "Snacks",
    price: 50,
    tags: ["Chaat", "Spicy", "Snacks"],
    description: "Crushed flaky potato samosa smothered with warm chole, seasoned dahi, tangy saunth, spicy mint chutney and crunchy bhujia.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Paneer Tikka Roll",
    category: "Snacks",
    price: 85,
    tags: ["Paneer", "Rolls", "Snacks"],
    description: "Smoky tandoori paneer skewers wrapped in a soft layered paratha with sliced capsicum, pickled red onions and mint mayo.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Chicken Kathi Roll",
    category: "Snacks",
    price: 95,
    tags: ["Non-Veg", "Rolls", "Snacks"],
    description: "Egg-coated flaky paratha rolled with juicy grilled chicken tikka strips, lime juice, chatpata masala and crisp onions.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: false,
  },
  {
    name: "Crispy French Fries (Peri-Peri)",
    category: "Snacks",
    price: 60,
    tags: ["Crispy", "Peri-Peri", "Snacks"],
    description: "Golden potato shoestrings deep fried to crisp perfection and dusted with spicy African bird's eye peri-peri seasoning.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },

  // Beverages
  {
    name: "Adrak Elaichi Chai (Kulhad)",
    category: "Beverages",
    price: 20,
    tags: ["Tea", "Hot Beverage", "Traditional"],
    description: "Traditional slow-brewed strong Assam CTC milk tea infused with crushed ginger and green cardamom pods, served in a clay cup.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "South Indian Filter Coffee",
    category: "Beverages",
    price: 25,
    tags: ["Coffee", "Hot Beverage", "South Indian"],
    description: "Authentic chicory-blended decoction frothed high with creamy boiling milk, served in the iconic brass dabarah set.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Classic Cold Coffee with Ice Cream",
    category: "Beverages",
    price: 55,
    tags: ["Cold Beverage", "Coffee", "Sweet"],
    description: "Thick chilled espresso blended with sweetened milk and Hershey's chocolate drizzle, crowned with a rich vanilla scoop.",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Kesar Badam Lassi",
    category: "Beverages",
    price: 45,
    tags: ["Cold Beverage", "Traditional", "Sweet"],
    description: "Churned sweet curd flavoured with saffron strands, crushed almonds, pistachios and a touch of rose water.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: false,
  },

  // Desserts
  {
    name: "Warm Gulab Jamun (2 Pcs)",
    category: "Desserts",
    price: 40,
    tags: ["Dessert", "Sweet", "Traditional"],
    description: "Soft spongy dumplings of fried milk solids soaked in rose and cardamom flavoured saffron sugar syrup.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Chocolate Walnut Brownie",
    category: "Desserts",
    price: 65,
    tags: ["Dessert", "Chocolate", "Bakery"],
    description: "Fudgy rich dark chocolate square baked with roasted Californian walnut chunks, served warm with cocoa glaze.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
];

/**
 * Seeder Function:
 * 1. Connects to MongoDB
 * 2. Clears old menu records (so we don't have duplicate items)
 * 3. Inserts all 12 dummy menu items
 * 4. Disconnects cleanly
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
    console.log('✓ Auto-seeded real menu prices and users into MongoDB!');
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