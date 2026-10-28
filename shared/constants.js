/**
 * The Lunchroom - Shared Domain Constants
 * Single source of truth for Roles, Order Statuses, and Menu Limits across frontend and backend.
 */

export const ROLES = {
  CUSTOMER: 'customer',
  STUDENT: 'student',
  ADMIN: 'admin',
  CAFETERIA_ADMIN: 'cafeteria_admin',
  STAFF: 'staff',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LIST = [
  'pending',
  'preparing',
  'ready',
  'completed',
  'cancelled',
];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
};

export const MENU_LIMITS = {
  MIN_PRICE: 1,
  MAX_PRICE: 1000,
  MAX_CART_QUANTITY: 20,
};

// CommonJS compatibility for Node.js backend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ROLES,
    ORDER_STATUS,
    ORDER_STATUS_LIST,
    PAYMENT_STATUS,
    MENU_LIMITS,
  };
}

export default {
  ROLES,
  ORDER_STATUS,
  ORDER_STATUS_LIST,
  PAYMENT_STATUS,
  MENU_LIMITS,
};

