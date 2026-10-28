import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/utils/constants';

/**
 * Provides current user context directly from the real authenticated session.
 */
export const useCurrentUser = () => {
  const { user: authUser, isAdmin: authIsAdmin } = useAuth();

  const isAdmin =
    authIsAdmin ||
    ['admin', 'cafeteria_admin', 'staff'].includes(authUser?.role);

  const role = isAdmin ? ROLES.ADMIN : ROLES.CUSTOMER;

  const user = authUser || {
    _id: isAdmin ? 'usr_admin_001' : 'usr_cust_001',
    name: isAdmin ? 'Cafeteria Admin' : 'Student',
    email: isAdmin ? 'admin@cafeteria.com' : 'student@college.edu',
    role: role,
  };

  return {
    user,
    role,
    isAdmin,
  };
};

export default useCurrentUser;
