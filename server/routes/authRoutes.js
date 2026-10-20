const express = require('express');
const router = express.Router();

/**
 * Authentication Routes
 * Owner: Student 1 (Authentication & User Management)
 * Routes to be implemented:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET  /api/auth/me
 * - POST /api/auth/logout
 */

router.get('/health', (req, res) => {
  res.json({ message: 'Auth service stub ready for Student 1 implementation' });
});

module.exports = router;
