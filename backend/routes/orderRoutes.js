const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Helper function to generate order numbers (e.g., ORD-618802-214)
const generateOrderNumber = () => {
  const part1 = Math.floor(100000 + Math.random() * 900000);
  const part2 = Math.floor(100 + Math.random() * 900);
  return `ORD-${part1}-${part2}`;
};

/**
 * 1. POST /api/orders
 * Feature: Place Order (Student 3)
 */
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, specialInstructions } = req.body;

    // Guard: Validate items array
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an order with an empty cart.' });
    }

    // Format order items to match Mongoose schema
    const formattedItems = items.map(item => ({
      menuItem: item.menuItem || item.food_id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal || item.price * item.quantity,
    }));

    // Create new Order document
    const newOrder = new Order({
      orderNumber: generateOrderNumber(),
      customer: customer || '654321654321654321654321', // Fallback ObjectId for local demo
      items: formattedItems,
      totalAmount: totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentId: '',
      specialInstructions: specialInstructions || '',
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      status: 'success',
      message: 'Order placed successfully!',
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

/**
 * 2. GET /api/orders/user/:userId
 * Feature: Get Customer Order History (Student 3)
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ customer: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      total_orders: orders.length,
      orders: orders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

module.exports = router;