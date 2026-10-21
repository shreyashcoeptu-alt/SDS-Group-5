/**
 * Student 4 — Admin Dashboard & Live Order Queue
 * Feature Owner: Student 4
 * 
 * Instructions for Student 4:
 * - Implement cafeteria staff live order dashboard, summaries, and sales analytics.
 * - Protect with `protect` and `authorize('cafeteria_admin')`.
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/summary', protect, authorize('cafeteria_admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cafeteria Admin Dashboard ready for Student 4 implementation.',
    incomingOrders: 0,
    dailyRevenue: 0,
  });
});

module.exports = router;
