const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user (customer or cafeteria_admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', phone, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Role validation
    const targetRole = role === 'cafeteria_admin' ? 'cafeteria_admin' : 'customer';

    // Verify admin secret key if registering as cafeteria_admin
    if (targetRole === 'cafeteria_admin') {
      const expectedSecret = process.env.ADMIN_SECRET_KEY || 'CAFE_ADMIN_2026';
      if (!adminSecretKey || adminSecretKey.trim() !== expectedSecret) {
        return res.status(403).json({
          success: false,
          message: 'Invalid Admin Security Key. Required to register as Cafeteria Staff/Admin (Default: CAFE_ADMIN_2026).',
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: targetRole,
      phone: phone ? phone.trim() : '',
      status: 'active',
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: `User registered successfully as ${user.role === 'cafeteria_admin' ? 'Cafeteria Admin' : 'Customer'}.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const email = req.body.email || req.body.collegeEmail;
    const credential = req.body.studentId || req.body.password;

    if (!email || !credential) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your college email and student ID (or password).',
      });
    }

    // Find user by email and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No student or user found with this email.',
      });
    }

    // Check credential match (studentId or password)
    const isMatch = await user.matchPassword(credential);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Student ID or password did not match.',
      });
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      student: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        batch: user.batch,
        department: user.department,
        role: user.role,
        status: user.status,
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        batch: user.batch,
        department: user.department,
        role: user.role,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (JWT protected)
 */
const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user data.',
    });
  }
};

/**
 * @desc    Logout user / invalidate session
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
