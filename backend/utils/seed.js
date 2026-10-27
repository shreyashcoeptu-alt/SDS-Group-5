const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
/**
 * Menu Item Seeder Script
 * Owner: Shantanu (Database seeder)
 * Seeds 20 realistic Indian cafeteria dishes for immediate team testing.
 */

const SEED_DATA = [
  {
    name: "Masala Dosa with Chutneys & Sambar",
    category: "Breakfast",
    price: 65,
    description: "Crispy golden fermented crepe filled with spiced potato masala, served with coconut chutney and piping hot drumstick sambar.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Steamed Idli Sambar (2 Pcs)",
    category: "Breakfast",
    price: 45,
    description: "Fluffy melt-in-mouth rice cakes tempered with mustard and curry leaves, accompanied by fresh tomato & mint chutney.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Poha with Roasted Peanuts & Sev",
    category: "Breakfast",
    price: 35,
    description: "Light flattened rice seasoned with turmeric, green chillies, caramelized onions and crunchy peanuts, topped with Ratlami sev.",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Egg Bhurji Pav (Double Egg)",
    category: "Breakfast",
    price: 55,
    description: "Desi style scrambled eggs tossed with fresh tomatoes, coriander, green chillies and garam masala, served with butter-toasted pav.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: true,
  },
  {
    name: "North Indian Mini Thali",
    category: "Meals",
    price: 110,
    description: "Comforting platter with Dal Makhani, Paneer Butter Masala, steamed Basmati rice, 2 whole wheat rotis, fresh salad and pickle.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Hyderabadi Chicken Dum Biryani",
    category: "Meals",
    price: 160,
    description: "Fragrant long-grain basmati rice cooked on dum with marinated tender chicken pieces, saffron, whole spices and mirchi ka salan.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: true,
  },
  {
    name: "Paneer Biryani with Burani Raita",
    category: "Meals",
    price: 135,
    description: "Layered aromatic basmati rice with golden grilled paneer cubes, mint, browned onions and cooling garlic yoghurt raita.",
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: false,
  },
  {
    name: "Rajma Chawal Bowl",
    category: "Meals",
    price: 85,
    description: "Slow-cooked Kashmiri red kidney beans in a spiced onion-tomato gravy layered over steamed jeera rice with sliced onions.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Butter Chicken with 2 Garlic Naans",
    category: "Meals",
    price: 175,
    description: "Tandoori chicken chunks simmered in a velvety buttery tomato gravy enriched with kasuri methi and fresh cream.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: true,
  },
  {
    name: "Mumbai Vada Pav (Plate of 2)",
    category: "Snacks",
    price: 40,
    description: "Golden spiced batata vada inside warm pav smeared with spicy garlic chutney, sweet tamarind and fiery green chilli paste.",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Crispy Samosa Chaat",
    category: "Snacks",
    price: 50,
    description: "Crushed flaky potato samosa smothered with warm chole, seasoned dahi, tangy saunth, spicy mint chutney and crunchy bhujia.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Paneer Tikka Roll",
    category: "Snacks",
    price: 85,
    description: "Smoky tandoori paneer skewers wrapped in a soft layered paratha with sliced capsicum, pickled red onions and mint mayo.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Chicken Kathi Roll",
    category: "Snacks",
    price: 95,
    description: "Egg-coated flaky paratha rolled with juicy grilled chicken tikka strips, lime juice, chatpata masala and crisp onions.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    isAvailable: false,
  },
  {
    name: "Crispy French Fries (Peri-Peri)",
    category: "Snacks",
    price: 60,
    description: "Golden potato shoestrings deep fried to crisp perfection and dusted with spicy African bird's eye peri-peri seasoning.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Adrak Elaichi Chai (Kulhad)",
    category: "Beverages",
    price: 20,
    description: "Traditional slow-brewed strong Assam CTC milk tea infused with crushed ginger and green cardamom pods, served in a clay cup.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "South Indian Filter Coffee",
    category: "Beverages",
    price: 25,
    description: "Authentic chicory-blended decoction frothed high with creamy boiling milk, served in the iconic brass dabarah set.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Classic Cold Coffee with Ice Cream",
    category: "Beverages",
    price: 55,
    description: "Thick chilled espresso blended with sweetened milk and Hershey's chocolate drizzle, crowned with a rich vanilla scoop.",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Kesar Badam Lassi",
    category: "Beverages",
    price: 45,
    description: "Churned sweet curd flavoured with saffron strands, crushed almonds, pistachios and a touch of rose water.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: false,
  },
  {
    name: "Warm Gulab Jamun (2 Pcs)",
    category: "Desserts",
    price: 40,
    description: "Soft spongy dumplings of fried milk solids soaked in rose and cardamom flavoured saffron sugar syrup.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
  {
    name: "Chocolate Walnut Brownie",
    category: "Desserts",
    price: 65,
    description: "Fudgy rich dark chocolate square baked with roasted Californian walnut chunks, served warm with cocoa glaze.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    isAvailable: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cafeteria_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing MenuItems...');
    await MenuItem.deleteMany({});

    console.log(`Inserting ${SEED_DATA.length} initial cafeteria dishes...`);
    await MenuItem.insertMany(SEED_DATA);

    console.log('✓ Database successfully seeded with cafeteria dishes!');
    process.exit(0);
  } catch (error) {
    console.error(`✗ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
