const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes: verify JWT Bearer token and attach active user to req.user
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey_replace_in_production'
      );

      // SECURITY: Always fetch fresh user data to check if they were suspended/deleted
      const user = await User.findById(decoded.id || decoded._id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Your account is suspended. Please contact the administrator.',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided in Authorization header.',
    });
  }
};

/**
 * Role-based authorization middleware
 * Supports synonymous roles (e.g., student = customer, staff = cafeteria_admin)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    // Group aliases together
    const isAdminRole = ['admin', 'cafeteria_admin', 'staff'].includes(userRole);
    const isCustomerRole = ['customer', 'student'].includes(userRole);
    
    const authorized =
      roles.includes(userRole) ||
      (roles.includes('admin') && isAdminRole) ||
      (roles.includes('staff') && isAdminRole) ||
      (roles.includes('customer') && isCustomerRole);

    if (!req.user || !authorized) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${userRole || 'anonymous'}' is not authorized to access this resource.`,
      });
    }
    
    next();
  };
};

module.exports = { 
  protect, 
  authorize 
};