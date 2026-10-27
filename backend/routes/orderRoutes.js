const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const VALID_STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

// @route   POST /api/orders
// @desc    Place a new order (Shared with Student 3)
// @access  Private (Customer/Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, specialInstructions, paymentStatus, paymentId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Fallback to a valid ObjectId if frontend sends mock string IDs like "menu_003"
    const sanitizedItems = items.map((item) => ({
      ...item,
      menuItem: mongoose.Types.ObjectId.isValid(item.menuItem)
        ? item.menuItem
        : new mongoose.Types.ObjectId(),
    }));

    const order = await Order.create({
      orderNumber,
      customer: req.user.id || req.user._id,
      items: sanitizedItems,
      totalAmount,
      specialInstructions: specialInstructions || '',
      paymentStatus: paymentStatus || 'pending',
      paymentId: paymentId || '',
      status: 'pending',
    });

    const populated = await Order.findById(order._id).populate('customer', 'name email phone');
    res.status(201).json(populated || order);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error placing order' });
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