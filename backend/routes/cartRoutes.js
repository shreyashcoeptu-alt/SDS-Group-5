/**
 * Student 3 — Cart & Order Placement
 * Feature Owner: Student 3
 * 
 * Instructions for Student 3:
 * 1. Create your models in `models/Cart.js` and `models/Order.js`
 * 2. Implement controllers in `controllers/cartController.js` and `controllers/orderController.js`
 * 3. Use Student 1's `protect` middleware to ensure customer authentication:
 *    - `req.user._id` provides the customer's ID automatically!
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart API endpoint ready for Student 3 implementation.',
    userId: req.user._id,
    items: [],
    totalPrice: 0,
  });
});

module.exports = router;
