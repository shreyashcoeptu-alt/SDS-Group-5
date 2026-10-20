const express = require('express');
const router = express.Router();

/**
 * Order Routes
 * Owner: Student 3 (Cart & Order Placement) & Student 4 (Order Tracking & Dashboard)
 * Routes to be implemented:
 * - POST /api/orders (Student 3: Place order)
 * - GET  /api/orders/my-orders (Student 4: Customer order history)
 * - GET  /api/orders/:id (Student 4: Track single order status)
 * - GET  /api/orders (Student 4: Admin cafeteria board)
 * - PATCH /api/orders/:id/status (Student 4: Update order status: pending -> preparing -> ready -> completed)
 */

router.get('/health', (req, res) => {
  res.json({ message: 'Order service stub ready for Student 3 & 4 implementation' });
});

module.exports = router;
