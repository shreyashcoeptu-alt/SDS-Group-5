import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Coffee, 
  LogOut, 
  User, 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    showToast('You have been safely signed out.', 'info');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand & Project Info */}
        <Link to="/" className="nav-brand">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ea580c, #f97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)'
          }}>
            <Coffee size={22} color="#ffffff" />
          </div>
          <div>
            <span>Campus<span className="logo-highlight">Bite</span></span>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: '500',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>
              Student 1 • Auth & Users
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              {isCustomer && (
                <Link
                  to="/customer"
                  className={`nav-link ${location.pathname === '/customer' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Customer Portal
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  >
                    <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    Admin Control
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                <User size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Profile
              </Link>

              {/* User Dropdown / Badge */}
              <div className="nav-user">
                <Link to="/profile" className="user-profile-badge" title="View Profile">
                  <div className={`avatar-circle ${isAdmin ? 'admin' : ''}`}>
                    {getInitials(user?.name)}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#fff' }}>
                      {user?.name?.split(' ')[0]}
                    </div>
                    <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-customer'}`} style={{ padding: '0 0.4rem', fontSize: '0.65rem' }}>
                      {isAdmin ? 'Cafeteria Admin' : 'Customer'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Sign out of account"
                  style={{ gap: '0.35rem', padding: '0.45rem 0.75rem' }}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Sparkles size={14} />
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
