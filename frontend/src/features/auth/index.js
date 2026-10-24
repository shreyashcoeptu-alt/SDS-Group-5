import React from 'react';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';

/**
 * Authentication & User Management Feature Module (Student 1)
 * Clean exports for page components and route definitions.
 */

export { LoginPage } from './pages/LoginPage';
export { AdminLoginPage } from './pages/AdminLoginPage';

export const authRoutes = [
  {
    path: '/login',
    element: React.createElement(LoginPage),
  },
  {
    path: '/signin',
    element: React.createElement(LoginPage),
  },
  {
    path: '/admin/login',
    element: React.createElement(AdminLoginPage),
  },
  {
    path: '/admin-login',
    element: React.createElement(AdminLoginPage),
  },
];

export default {
  LoginPage,
  AdminLoginPage,
  authRoutes,
};
