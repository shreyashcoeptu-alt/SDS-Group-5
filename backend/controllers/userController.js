const User = require('../models/User');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update current user profile (name, phone)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Change current user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    // Retrieve user with password field
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please keep it secure.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all users with search and filter (Admin only)
 * @route   GET /api/users
 * @access  Private (Cafeteria Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, search, status } = req.query;
    const query = {};

    if (role && ['customer', 'cafeteria_admin'].includes(role)) {
      query.role = role;
    }

    if (status && ['active', 'suspended'].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user statistics (total, customers, admins)
 * @route   GET /api/users/stats
 * @access  Private (Cafeteria Admin only)
 */
const getUserStats = async (req, res) => {
  try {
    const [totalUsers, totalCustomers, totalAdmins, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'cafeteria_admin' }),
      User.countDocuments({ status: 'active' }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalAdmins,
        activeUsers,
        suspendedUsers: totalUsers - activeUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private (Cafeteria Admin only)
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update user role or status (Admin only)
 * @route   PUT /api/users/:id/role-status
 * @access  Private (Cafeteria Admin only)
 */
const updateUserRoleOrStatus = async (req, res) => {
  try {
    const { role, status } = req.body;
    const targetUserId = req.params.id;

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent admin from demoting or suspending their own active account
    if (user._id.toString() === req.user._id.toString()) {
      if (role && role !== 'cafeteria_admin') {
        return res.status(400).json({
          success: false,
          message: 'You cannot demote your own administrator account.',
        });
      }
      if (status && status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'You cannot suspend your own administrator account.',
        });
      }
    }

    if (role && ['customer', 'cafeteria_admin'].includes(role)) {
      user.role = role;
    }

    if (status && ['active', 'suspended'].includes(status)) {
      user.status = status;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: `User updated successfully. Role: ${updatedUser.role}, Status: ${updatedUser.status}.`,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete user account (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private (Cafeteria Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Prevent self-deletion
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own logged-in account.',
      });
    }

    const user = await User.findByIdAndDelete(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `User '${user.name}' has been successfully removed.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserStats,
  getUserById,
  updateUserRoleOrStatus,
  deleteUser,
};
