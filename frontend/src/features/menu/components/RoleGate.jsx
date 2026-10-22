import React from 'react';
import { Link } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import Button from '@/components/ui/Button';
import { ROLES } from '@/utils/constants';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

/**
 * RoleGate component.
 * Ensures the wrapped view is only accessible to users with the Admin role.
 * Non-admins see a polite unauthorized barrier with clear recovery options.
 *
 * NOTE: When Student 1's authentication is integrated, replace useCurrentUser
 * with the central AuthContext / ProtectedRoute.
 */
export const RoleGate = ({ children }) => {
  const { user, isAdmin, setRole } = useCurrentUser();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cafe-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-cafe-border p-8 sm:p-10 max-w-md w-full text-center shadow-card animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold font-display text-cafe-text mb-2">
            Administrator Access Required
          </h2>

          <p className="text-sm text-cafe-subtext mb-6 leading-relaxed">
            You are currently signed in as <strong className="text-cafe-text font-bold">{user.name}</strong>. Menu editing and stock availability controls are restricted to cafeteria managers.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              onClick={() => setRole(ROLES.ADMIN)}
              className="w-full"
            >
              Switch to Admin Role (Dev Demo)
            </Button>

            <Link to="/menu" className="w-full">
              <Button variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Customer Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleGate;
