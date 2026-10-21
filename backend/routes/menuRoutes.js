/**
 * Student 2 — Menu & Food Management
 * Feature Owner: Student 2
 * 
 * Instructions for Student 2:
 * 1. Create your model in `models/MenuItem.js` or `models/FoodItem.js`
 * 2. Implement controllers in `controllers/menuController.js`
 * 3. Mount your routes below. Student 1's authentication middleware is ready:
 *    - Use `protect` to require login
 *    - Use `authorize('cafeteria_admin')` for admin actions (add/edit/delete menu items)
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Placeholder public menu listing route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Menu API endpoint ready for Student 2 implementation.',
    category: 'menu',
    items: [],
  });
});

module.exports = router;
