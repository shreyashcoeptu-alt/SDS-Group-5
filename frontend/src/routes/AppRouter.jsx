import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoginPage, RegisterPage, AdminLoginPage } from '@/features/auth';
import { MenuPage, MenuManagerPage } from '@/features/menu';
import { CustomerOrdersPage, OrderTrackingPage, AdminOrdersDashboardPage } from '@/features/orders';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Coffee, ArrowLeft } from 'lucide-react';

/**
 * Root Landing Redirect
 * Redirects to /admin/orders for admins, /menu for students, or /login for guests.
 */
const RootRedirect = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cafe-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/orders" replace />;
  }

  return <Navigate to="/menu" replace />;
};

/**
 * Unified App Router for The Lunchroom
 * - Public routes: /login, /signin, /register, /signup, /admin/login
 * - Customer routes: /menu, /orders, /orders/:id
 * - Admin routes: /admin/menu, /admin/orders, /admin/dashboard
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Customer Routes (Protected) */}
      <Route
        path="/menu"
        element={
          <ProtectedRoute allowedRoles={['customer', 'student']}>
            <MenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={['customer', 'student']}>
            <Navigate to="/menu" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={['customer', 'student']}>
            <Navigate to="/menu" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={['customer', 'student']}>
            <CustomerOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['customer', 'student', 'admin', 'cafeteria_admin', 'staff']}>
            <OrderTrackingPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes (Restricted to Admin / Cafeteria Staff) */}
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute allowedRoles={['admin', 'cafeteria_admin', 'staff']}>
            <MenuManagerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['admin', 'cafeteria_admin', 'staff']}>
            <AdminOrdersDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'cafeteria_admin', 'staff']}>
            <AdminOrdersDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={<Navigate to="/admin/orders" replace />}
      />

      {/* 404 Not Found Fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-cafe-bg flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-cafe-border p-8 max-w-md w-full text-center shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-display text-cafe-text mb-1">
                Page Not Found
              </h2>
              <p className="text-sm text-cafe-subtext mb-6">
                The requested URL does not exist or has moved.
              </p>
              <Link to="/menu">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Menu</span>
                </button>
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;