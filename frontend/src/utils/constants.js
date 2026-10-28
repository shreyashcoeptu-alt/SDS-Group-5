export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  STAFF: 'staff',
};

export const API_ENDPOINTS = {
  MENU: '/menu',
  MENU_ITEM: (id) => `/menu/${id}`,
  MENU_AVAILABILITY: (id) => `/menu/${id}/availability`,
  ORDERS: '/orders',
  MY_ORDERS: '/orders/my-orders',
  ORDER_SUMMARY: '/orders/summary',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  ORDER_STATUS: (id) => `/orders/${id}/status`,
};

export const STORAGE_KEYS = {
  MENU_ITEMS: 'cafeteria_menu_items_v1',
  ORDERS: 'cafeteria_orders_v1',
  AUTH_DEMO_ROLE: 'cafeteria_demo_role',
};

export const ORDER_STATUSES = [
  'pending',
  'preparing',
  'ready',
  'completed',
  'cancelled',
];

export const DEFAULT_CATEGORIES = [
  'All',
  'Breakfast',
  'Meals',
  'Snacks',
  'Beverages',
  'Desserts',
];

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
];