const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserRoleOrStatus,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer & Admin self profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Cafeteria Admin only user management routes
router.get('/stats', protect, authorize('cafeteria_admin'), getUserStats);
router.get('/', protect, authorize('cafeteria_admin'), getAllUsers);
router.get('/:id', protect, authorize('cafeteria_admin'), getUserById);
router.put('/:id/role-status', protect, authorize('cafeteria_admin'), updateUserRoleOrStatus);
router.delete('/:id', protect, authorize('cafeteria_admin'), deleteUser);

module.exports = router;
