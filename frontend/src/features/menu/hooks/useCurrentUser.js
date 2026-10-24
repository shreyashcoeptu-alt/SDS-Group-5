import { useState, useEffect } from 'react';
import { ROLES, STORAGE_KEYS } from '@/utils/constants';

/**
 * Provides current user context derived from the authenticated session.
 * Connects to login state in localStorage without depending on the old Dev Mode switcher.
 */
export const useCurrentUser = () => {
  const getRoleFromSession = () => {
    const email = (localStorage.getItem('lunchroom:student_email') || '').toLowerCase().trim();
    const savedRole = localStorage.getItem(STORAGE_KEYS.AUTH_DEMO_ROLE);

    // If signed-in email contains 'admin' or saved role is admin, grant admin privileges
    if (email.includes('admin') || savedRole === ROLES.ADMIN) {
      return ROLES.ADMIN;
    }
    return ROLES.CUSTOMER;
  };

  const [role, setRoleState] = useState(getRoleFromSession);

  const setRole = (newRole) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_DEMO_ROLE, newRole);
    setRoleState(newRole);
    window.dispatchEvent(new Event('role_changed'));
  };

  useEffect(() => {
    const handleRoleChanged = () => {
      setRoleState(getRoleFromSession());
    };
    window.addEventListener('role_changed', handleRoleChanged);
    return () => window.removeEventListener('role_changed', handleRoleChanged);
  }, []);

  const isAdmin = role === ROLES.ADMIN;
  const storedEmail = localStorage.getItem('lunchroom:student_email');

  const user = {
    _id: isAdmin ? 'usr_admin_001' : 'usr_cust_001',
    name: isAdmin ? 'Cafeteria Admin' : 'Student',
    email: storedEmail || (isAdmin ? 'admin.cafeteria@college.edu' : 'student@college.edu'),
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
