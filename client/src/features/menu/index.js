import React from 'react';
import MenuPage from './pages/MenuPage';
import MenuManagerPage from './pages/MenuManagerPage';
import RoleGate from './components/RoleGate';

/**
 * Menu & Food Management Feature Module (Student 2)
 * Clean exports for page components and route definitions.
 */

export { MenuPage } from './pages/MenuPage';
export { MenuManagerPage } from './pages/MenuManagerPage';
export { useMenu } from './hooks/useMenu';
export { useCurrentUser } from './hooks/useCurrentUser';
export { useMenuFilters } from './hooks/useMenuFilters';

/**
 * Route definitions to be mounted in AppRouter.jsx.
 * Uses React.createElement to keep index.js strictly pure JavaScript for Vite compatibility.
 */
export const menuRoutes = [
  {
    path: '/menu',
    element: React.createElement(MenuPage),
  },
  {
    path: '/admin/menu',
    element: React.createElement(
      RoleGate,
      null,
      React.createElement(MenuManagerPage)
    ),
  },
];

export default {
  MenuPage,
  MenuManagerPage,
  menuRoutes,
};
