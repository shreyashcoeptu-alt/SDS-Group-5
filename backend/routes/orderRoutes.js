const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middleware/auth');
const { ORDER_STATUS_LIST } = require('../../shared/constants');

const VALID_STATUSES = ORDER_STATUS_LIST || ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

// Helper function to generate order numbers (e.g., ORD-618802-214)
const generateOrderNumber = () => {
  const part1 = Math.floor(100000 + Math.random() * 900000);
  const part2 = Math.floor(100 + Math.random() * 900);
  return `ORD-${part1}-${part2}`;
};

/**
 * 1. POST /api/orders
 * Feature: Place Order (Shared / Protected)
 */
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, specialInstructions, paymentStatus, paymentId } = req.body;

    // Guard: Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an order with an empty cart.' });
    }

    // Safely parse or assign a valid ObjectId for menuItem
    const formattedItems = items.map((item) => {
      const rawId = item.menuItem || item.food_id || item.id;
      const validObjectId = mongoose.Types.ObjectId.isValid(rawId)
        ? rawId
        : new mongoose.Types.ObjectId();

      return {
        menuItem: validObjectId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal || item.price * item.quantity,
      };
    });

    let customerId = customer;
    let userRole = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lunchroom_super_secret_jwt_key_2026');
        if (decoded?.id) customerId = decoded.id;
        if (decoded?.role) userRole = decoded.role;
      } catch (e) {
        // Fall back to customer passed in body
      }
    }

    // Guard: Admins cannot place orders
    if (userRole && ['admin', 'cafeteria_admin', 'staff'].includes(userRole)) {
      return res.status(403).json({ message: "Admins can’t place orders." });
    }

    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      const userDoc = await User.findById(customerId).select('role');
      if (userDoc && ['admin', 'cafeteria_admin', 'staff'].includes(userDoc.role)) {
        return res.status(403).json({ message: "Admins can’t place orders." });
      }
    }

    const validCustomer = mongoose.Types.ObjectId.isValid(customerId)
      ? customerId
      : new mongoose.Types.ObjectId();

    // Create new Order document
    const newOrder = new Order({
      orderNumber: generateOrderNumber(),
      customer: validCustomer,
      items: formattedItems,
      totalAmount,
      status: 'pending',
      paymentStatus: paymentStatus || 'pending',
      paymentId: paymentId || '',
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
      orders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged-in customer's order history
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const orders = await Order.find({ customer: userId })
      .sort({ createdAt: -1 })
      .populate('customer', 'name email');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching your orders' });
  }
});

// @route   GET /api/orders/summary
// @desc    Get basic order summaries and revenue totals for Admin Dashboard
// @access  Admin / Staff
router.get('/summary', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) =>
      ['pending', 'preparing', 'ready'].includes(o.status)
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const statusBreakdown = {
      pending: orders.filter((o) => o.status === 'pending').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      completed: completedOrders,
      cancelled: cancelledOrders,
    };

    res.json({
      totalOrders,
      activeOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      statusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error calculating order summary' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders for cafeteria staff board (supports ?status= filter)
// @access  Admin / Staff
router.get('/', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('customer', 'name email phone');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching cafeteria orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID or orderNumber for live status tracking
// @access  Private (Owner or Admin/Staff)
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const query = isObjectId ? { _id: id } : { orderNumber: id };
    const order = await Order.findOne(query).populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const requesterId = String(req.user?.id || req.user?._id || '');
    const ownerId = String(order.customer?._id || order.customer || '');
    const isStaffOrAdmin = ['admin', 'staff'].includes(req.user?.role);

    if (ownerId && requesterId && requesterId !== ownerId && !isStaffOrAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching order details' });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status (pending -> preparing -> ready -> completed / cancelled)
// @access  Admin / Staff
router.patch('/:id/status', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error updating order status' });
  }
});

module.exports = router;
