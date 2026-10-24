import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import { ROLES } from '@/utils/constants';
import { UserCheck, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import menuApi from '../api/menuApi';

/**
 * Floating Dev Role Switcher Pill.
 * Only rendered in mock development mode (VITE_USE_MOCKS=true).
 * Allows instant toggling between Customer and Admin modes to verify both interfaces.
 */
export const DevRoleSwitcher = () => {
  const isMock = import.meta.env.VITE_USE_MOCKS !== 'false';
  const { role, isAdmin, setRole } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isMock) return null;

  const toggleRole = () => {
    const nextRole = isAdmin ? ROLES.CUSTOMER : ROLES.ADMIN;
    setRole(nextRole);
    if (nextRole === ROLES.ADMIN && location.pathname === '/menu') {
      navigate('/admin/menu');
    } else if (nextRole === ROLES.CUSTOMER && location.pathname.startsWith('/admin')) {
      navigate('/menu');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all menu items to original seed data?')) {
      menuApi.resetMockData();
      window.location.reload();
    }
  };

  return (
    <aside
      aria-label="Development Role Switcher"
      className="fixed bottom-3 sm:bottom-5 left-3 sm:left-5 z-40 max-w-[calc(100vw-1.5rem)] overflow-hidden flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 bg-stone-900/90 backdrop-blur-md text-white rounded-full shadow-2xl border border-stone-700/80 text-[11px] sm:text-xs animate-fade-in select-none"
    >
      <div className="flex items-center gap-1 sm:gap-1.5 pl-2 sm:pl-2.5 pr-0.5 sm:pr-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="hidden sm:inline text-[11px] font-mono text-stone-400">DEV MODE:</span>
        <span className="font-bold text-stone-200">
          {isAdmin ? 'Admin' : 'Customer'}
        </span>
      </div>

      <button
        type="button"
        onClick={toggleRole}
        className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-stone-800 hover:bg-brand-600 text-stone-200 hover:text-white font-medium transition-all"
        title="Switch active role"
      >
        {isAdmin ? <UserCheck className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">Switch to {isAdmin ? 'Customer' : 'Admin'}</span>
        <span className="sm:hidden">Switch</span>
      </button>

      {/* Quick navigation links */}
      {location.pathname === '/menu' && isAdmin && (
        <button
          type="button"
          onClick={() => navigate('/admin/menu')}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          title="Open Admin Manager"
        >
          <span>Admin</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      )}

      {location.pathname.startsWith('/admin') && (
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          title="Open Customer Menu"
        >
          <span>Customer</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      )}

      {location.pathname !== '/login' ? (
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-rose-300 hover:text-white hover:bg-rose-900/50 transition-colors"
          title="Open Student Login Portal"
        >
          <span>Login</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          title="Open Customer Menu"
        >
          <span>Menu</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      )}

      <button
        type="button"
        onClick={handleResetData}
        className="p-1 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        title="Reset mock items to seed"
      >
        <RefreshCw className="w-3 h-3" />
      </button>
    </aside>
  );
};

export default DevRoleSwitcher;
