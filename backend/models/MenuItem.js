// ==============================================================================
// FILE: backend/models/MenuItem.js
// STUDENT: Shreyash (Student 2 - Menu & Food Management)
// PURPOSE: Defines the MongoDB Schema & Model for our Cafeteria Food Items
// ==============================================================================

// Step 1: Import mongoose
// Mongoose is a library that helps Node.js talk to MongoDB easily.
// Think of it like an interface between JavaScript objects and MongoDB collections.
const mongoose = require('mongoose');

// Step 2: Define the Food Item Schema
// A "Schema" is a blueprint or template for what each food item document in our database should look like.
// It defines the subparts: name, price, tags, category, description, availability, and image.
const foodItemSchema = new mongoose.Schema(
  {
    // Subpart 1: Item Name
    name: {
      type: String,                               // The value must be text
      required: [true, 'Dish name is required'],  // Cannot be empty
      trim: true,                                 // Removes accidental spaces from start and end
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },

    // Subpart 2: Price in INR
    price: {
      type: Number,                               // Must be a number
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],       // Cannot be less than 0
    },

    // Subpart 3: Category (e.g., Breakfast, Meals, Snacks, Beverages, Desserts)
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Snacks',
    },

    // Subpart 4: Tags (Array of labels like ['spicy', 'bestseller', 'crispy', 'street-food'])
    // This allows the cafeteria app to filter or badge items easily
    tags: {
      type: [String],                             // An array (list) of strings
      default: [],                                // Defaults to an empty list
    },

    // Subpart 5: Description
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },

    // Subpart 6: Image URL (Cloudinary link or web URL)
    image: {
      type: String,
      default: '',                                // Can be empty if no photo is provided yet
      trim: true,
    },

    // Subpart 7: Veg or Non-Veg Flag
    isVeg: {
      type: Boolean,                              // true = vegetarian (green dot), false = non-vegetarian (red dot)
      required: true,
      default: true,
    },

    // Subpart 8: Availability Flag (Menu available options)
    // When cafeteria runs out of samosas, admin toggles this to false!
    isAvailable: {
      type: Boolean,                              // true = in stock / orderable, false = sold out
      required: true,
      default: true,
    },
  },
  {
    // Automatically creates two fields in MongoDB:
    // createdAt (when item was added) & updatedAt (when it was last edited)
    timestamps: true,
  }
);

// Optional Helper: Create a text index on name & description
// This makes searching for dishes like "samosa" or "dosa" super fast in MongoDB
foodItemSchema.index({ name: 'text', description: 'text', category: 1 });

// Step 3: Create the Mongoose Model
// A Model is the actual JavaScript tool we use to query the DB (e.g., MenuItem.find(), MenuItem.create())
// In MongoDB, this will create/use a collection named "menuitems" (pluralized automatically).
const MenuItem = mongoose.model('MenuItem', foodItemSchema);

// Export the model so our controllers can import and use it
module.exports = MenuItem;
