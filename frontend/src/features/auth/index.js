import React from 'react';
import LoginPage from './pages/LoginPage';
<<<<<<< HEAD
import AdminLoginPage from './pages/AdminLoginPage';

/**
 * Authentication & User Management Feature Module (Student 1)
 * Clean exports for page components and route definitions.
 */

export { LoginPage } from './pages/LoginPage';
=======
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';

export { LoginPage } from './pages/LoginPage';
export { RegisterPage } from './pages/RegisterPage';
>>>>>>> main
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
<<<<<<< HEAD
    path: '/admin/login',
    element: React.createElement(AdminLoginPage),
  },
  {
    path: '/admin-login',
=======
    path: '/register',
    element: React.createElement(RegisterPage),
  },
  {
    path: '/signup',
    element: React.createElement(RegisterPage),
  },
  {
    path: '/admin/login',
>>>>>>> main
    element: React.createElement(AdminLoginPage),
  },
];

export default {
  LoginPage,
<<<<<<< HEAD
=======
  RegisterPage,
>>>>>>> main
  AdminLoginPage,
  authRoutes,
};
