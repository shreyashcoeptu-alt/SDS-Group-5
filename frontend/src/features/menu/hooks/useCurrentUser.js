import { useState, useEffect } from 'react';
import { ROLES, STORAGE_KEYS } from '@/utils/constants';

/**
 * INTEGRATION STUB: Auth Integration
 * 
 * IMPORTANT: Replace this hook with Student 1's AuthContext when merged.
 * 
 * Provides current user context with demo role switching for testing
 * both the customer menu (/menu) and admin management (/admin/menu).
 */
export const useCurrentUser = () => {
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_DEMO_ROLE) || ROLES.ADMIN;
  });

  const setRole = (newRole) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_DEMO_ROLE, newRole);
    setRoleState(newRole);
    // Dispatch storage event so other components or tabs sync if needed
    window.dispatchEvent(new Event('role_changed'));
  };

  useEffect(() => {
    const handleRoleChanged = () => {
      const current = localStorage.getItem(STORAGE_KEYS.AUTH_DEMO_ROLE) || ROLES.ADMIN;
      setRoleState(current);
    };
    window.addEventListener('role_changed', handleRoleChanged);
    return () => window.removeEventListener('role_changed', handleRoleChanged);
  }, []);

  const isAdmin = role === ROLES.ADMIN;

  const user = {
    _id: isAdmin ? 'usr_admin_001' : 'usr_cust_001',
    name: isAdmin ? 'Admin Chef (Demo)' : 'Aarav Sharma (Student)',
    email: isAdmin ? 'admin.cafeteria@college.edu' : 'aarav.cs23@college.edu',
    role: role,
  };

  return {
    user,
    role,
    isAdmin,
    setRole,
  };
};

export default useCurrentUser;
