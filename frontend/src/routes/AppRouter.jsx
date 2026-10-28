import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { menuRoutes } from '@/features/menu';
import { orderRoutes } from '@/features/orders';
import { authRoutes } from '@/features/auth';
import { Coffee, ArrowLeft } from 'lucide-react';

/**
 * App Router
 * Combines feature routes for:
 * - Student 1: Auth (/login, /signin)
 * - Student 2: Menu & Food Management (/menu)
 * - Student 3 & 4: Orders, Cart, & Admin Dashboard (/orders, /admin/orders)
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/menu" replace />} />

      {/* Student 1: Authentication Routes (/login, /signin) */}
      {authRoutes?.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}

      {/* Student 2: Menu & Food Management Routes */}
      {menuRoutes?.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Student 3 & 4: Order Tracking & Admin Dashboard Routes */}
      {orderRoutes?.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

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