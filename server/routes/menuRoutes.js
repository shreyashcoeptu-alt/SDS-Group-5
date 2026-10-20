const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');

/**
 * Menu Routes
 * Route Handlers: Sarthak & Sherwin
 * Feature Scope: Menu & Food Management (Student 2 - Shreyash)
 */

// @route   GET /api/menu
// @desc    Get all menu items (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching menu' });
  }
});

// @route   POST /api/menu
// @desc    Create a new menu item
// @access  Admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, category, price, description, image, isVeg, isAvailable } = req.body;

    const newItem = await MenuItem.create({
      name,
      category,
      price,
      description,
      image,
      isVeg,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error creating menu item' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update an existing menu item
// @access  Admin only
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error updating menu item' });
  }
});

// @route   PATCH /api/menu/:id/availability
// @desc    Quick toggle availability of a dish
// @access  Admin only
router.patch('/:id/availability', protect, authorize('admin'), async (req, res) => {
  try {
    const { isAvailable } = req.body;
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'isAvailable must be a boolean' });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error updating availability' });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await item.deleteOne();
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting menu item' });
  }
});

module.exports = router;
