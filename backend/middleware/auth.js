const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Owner: Student 1 (Auth)
 */

// Protect routes - verifies JWT bearer token
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_replace_in_production');
    req.user = decoded; // { id, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed or expired.',
    });
  }
};

// Grant access to specific roles (e.g. 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
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
        message: `Role '${req.user?.role || 'anonymous'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
