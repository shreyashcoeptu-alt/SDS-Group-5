import {
  ROLES as SHARED_ROLES,
  ORDER_STATUS_LIST,
  MENU_LIMITS as SHARED_MENU_LIMITS,
} from '../../../shared/constants';

export const ROLES = {
  ...SHARED_ROLES,
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  STAFF: 'staff',
  CAFETERIA_ADMIN: 'cafeteria_admin',
};

export const ORDER_STATUSES = ORDER_STATUS_LIST;

export const MENU_LIMITS = SHARED_MENU_LIMITS;

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
  MENU_ITEMS: 'lunchroom_menu_items_v1',
  ORDERS: 'lunchroom_orders_v1',
  AUTH_DEMO_ROLE: 'lunchroom_role',
  CART: 'lunchroom_cart_v1',
};

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
