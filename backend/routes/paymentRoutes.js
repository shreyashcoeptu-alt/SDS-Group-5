const express = require('express');
const router = express.Router();

/**
 * Payment Routes
 * Owner: Student 3 (Razorpay / Payment Gateway)
 * Routes to be implemented:
 * - POST /api/payment/create-order
 * - POST /api/payment/verify
 */

router.get('/health', (req, res) => {
  res.json({ message: 'Payment service stub ready for Student 3 implementation' });
});

module.exports = router;
