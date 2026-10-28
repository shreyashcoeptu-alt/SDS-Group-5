import React from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';

export { LoginPage } from './pages/LoginPage';
export { RegisterPage } from './pages/RegisterPage';
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
    path: '/register',
    element: React.createElement(RegisterPage),
  },
  {
    path: '/signup',
    element: React.createElement(RegisterPage),
  },
  {
    path: '/admin/login',
    element: React.createElement(AdminLoginPage),
  },
];

export default {
  LoginPage,
  RegisterPage,
  AdminLoginPage,
  authRoutes,
};
