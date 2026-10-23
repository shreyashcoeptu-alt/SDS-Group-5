import React from 'react';
import LoginPage from './pages/LoginPage';

/**
 * Authentication & User Management Feature Module (Student 1)
 * Clean exports for page components and route definitions.
 */

export { LoginPage } from './pages/LoginPage';

export const authRoutes = [
  {
    path: '/login',
    element: React.createElement(LoginPage),
  },
  {
    path: '/signin',
    element: React.createElement(LoginPage),
  },
];

export default {
  LoginPage,
  authRoutes,
};
