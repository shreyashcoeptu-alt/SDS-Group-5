const mongoose = require('mongoose');

/**
 * MenuItem Schema
 * Owner: Shantanu (Database Model)
 * Feature: Menu & Food Management (Student 2 - Shreyash)
 */
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than zero'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isVeg: {
      type: Boolean,
      required: true,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search optimization
menuItemSchema.index({ name: 'text', description: 'text', category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
