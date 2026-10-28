import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * ProtectedRoute: Guarantees authenticated access, with role restriction
 * @param {Array} allowedRoles e.g. ['customer'], ['admin']
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mb-3" />
        <p className="text-xs text-stone-500 font-medium">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    const isAdmin = ['admin', 'cafeteria_admin', 'staff'].includes(userRole);
    const isCustomer = ['customer', 'student'].includes(userRole);

    const hasPermission =
      allowedRoles.includes(userRole) ||
      (allowedRoles.includes('admin') && isAdmin) ||
      (allowedRoles.includes('customer') && isCustomer);

    if (!hasPermission) {
      if (isAdmin) {
        return <Navigate to="/admin/orders" replace />;
      }
      return <Navigate to="/menu" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
