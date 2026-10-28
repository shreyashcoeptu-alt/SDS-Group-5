import React from 'react';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminOrdersDashboardPage from './pages/AdminOrdersDashboardPage';
import RoleGate from '@/features/menu/components/RoleGate';

export { CustomerOrdersPage } from './pages/CustomerOrdersPage';
export { OrderTrackingPage } from './pages/OrderTrackingPage';
export { AdminOrdersDashboardPage } from './pages/AdminOrdersDashboardPage';

export const orderRoutes = [
  {
    path: '/orders',
    element: React.createElement(CustomerOrdersPage),
  },
  {
    path: '/orders/:id',
    element: React.createElement(OrderTrackingPage),
  },
  {
    path: '/admin/orders',
    element: React.createElement(
      RoleGate,
      null,
      React.createElement(AdminOrdersDashboardPage)
    ),
  },
  {
    path: '/admin/dashboard',
    element: React.createElement(
      RoleGate,
      null,
      React.createElement(AdminOrdersDashboardPage)
    ),
  },
];

export default {
  CustomerOrdersPage,
  OrderTrackingPage,
  AdminOrdersDashboardPage,
  orderRoutes,
};