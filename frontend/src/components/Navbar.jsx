<<<<<<< HEAD
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Zap, 
  LogOut, 
  User, 
  ShieldCheck, 
  LayoutDashboard, 
  Sparkles
} from 'lucide-react';
=======
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/features/cart';
import { useToast } from '@/components/ui/Toast';
import { ShoppingBag, Menu, X, ArrowLeft } from 'lucide-react';
>>>>>>> main

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't render full navbar on pure auth pages if user prefers clean auth screen
  const isAuthPage = ['/login', '/signin', '/register', '/signup', '/admin/login'].includes(location.pathname);
  if (isAuthPage && !isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('You have been logged out.', 'Signed Out');
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;
  const isStudentViewForAdmin = isAdmin && (location.pathname === '/menu' || location.pathname.startsWith('/orders/'));

  return (
<<<<<<< HEAD
    <header className="navbar">
      <div className="nav-container">
        {/* Brand & Project Info */}
        <Link to="/" className="nav-brand">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: '#0F0F11',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Zap size={18} fill="#FFFFFF" />
          </div>
          <div>
            <span>The <span className="logo-highlight">Lunchroom</span></span>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: '600',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginTop: '2px'
            }}>
              Campus Dining Platform
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
=======
    <header className="sticky top-0 z-40 bg-white border-b-2 border-stone-900 select-none">
      {/* Top Banner if Admin is viewing student menu */}
      {isStudentViewForAdmin && (
        <div className="bg-amber-400 text-stone-900 px-4 py-1.5 text-xs font-bold flex items-center justify-between border-b border-stone-900">
          <span>You are viewing the Student Menu as an Administrator</span>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to admin</span>
          </Link>
        </div>
      )}
>>>>>>> main

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <Link
              to={isAdmin ? '/admin/orders' : '/menu'}
              className="font-black text-xl sm:text-2xl tracking-tight text-stone-900 hover:opacity-90 flex items-center gap-2"
            >
              <span className="w-3 h-3 rounded-full bg-[#E23744]" />
              <span>The Lunchroom</span>
              {isAdmin && (
<<<<<<< HEAD
                <Link
                  to="/admin"
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Admin Control
                </Link>
=======
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-white ml-1">
                  Admin
                </span>
>>>>>>> main
              )}
            </Link>
          </div>

<<<<<<< HEAD
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
                    <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                      {user?.name?.split(' ')[0]}
                    </div>
                    <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-customer'}`} style={{ padding: '0 0.4rem', fontSize: '0.65rem' }}>
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
=======
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {!isAdmin ? (
              /* Student Navigation */
              <>
                <Link
                  to="/menu"
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/menu')
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Menu
>>>>>>> main
                </Link>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                  aria-label="Open Cart"
                >
<<<<<<< HEAD
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link 
                to="/admin-login" 
                className="btn btn-secondary btn-sm"
                style={{
                  borderColor: 'rgba(168, 85, 247, 0.4)',
                  color: '#c084fc',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <ShieldCheck size={14} color="#a855f7" />
                <span>Admin Portal</span>
              </Link>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Sparkles size={14} />
                Get Started
              </Link>
=======
                  <ShoppingBag className="w-4 h-4 text-[#E23744]" />
                  <span>Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#E23744] text-white text-xs font-black flex items-center justify-center">
                      {totalItemsCount}
                    </span>
                  )}
                </button>

                {isAuthenticated && (
                  <Link
                    to="/orders"
                    className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                      isActive('/orders')
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    My orders
                  </Link>
                )}
              </>
            ) : (
              /* Admin Navigation */
              <>
                <Link
                  to="/admin/menu"
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/admin/menu')
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Menu manager
                </Link>

                <Link
                  to="/admin/orders"
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/admin/orders')
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Incoming orders
                </Link>

                <Link
                  to="/menu"
                  className="px-3 py-2 rounded-xl text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
                >
                  View as student
                </Link>
              </>
            )}

            {/* User Profile info & Logout */}
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-stone-200">
              {isAuthenticated ? (
                <>
                  <div className="text-right leading-none hidden lg:block">
                    <span className="block text-xs font-bold text-stone-900">
                      {user?.name || (isAdmin ? 'Admin' : 'Student')}
                    </span>
                    <span className="text-[10px] text-stone-400 capitalize">
                      {isAdmin ? 'Staff / Admin' : 'Customer'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
>>>>>>> main
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl text-stone-800 hover:bg-stone-100"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#E23744]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E23744] text-white text-[11px] font-bold flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-800 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 flex flex-col gap-2">
            {!isAdmin ? (
              <>
                <Link
                  to="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold ${
                    isActive('/menu') ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Menu
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-left text-stone-700 hover:bg-stone-100 flex items-center justify-between"
                >
                  <span>Cart</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#E23744] text-white">
                    {totalItemsCount}
                  </span>
                </button>

                {isAuthenticated && (
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold ${
                      isActive('/orders') ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    My orders
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/admin/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold ${
                    isActive('/admin/menu') ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Menu manager
                </Link>

                <Link
                  to="/admin/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold ${
                    isActive('/admin/orders') ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Incoming orders
                </Link>

                <Link
                  to="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200"
                >
                  View as student
                </Link>
              </>
            )}

            <div className="pt-3 mt-2 border-t border-stone-200 flex items-center justify-between px-2">
              {isAuthenticated ? (
                <>
                  <div className="text-xs font-bold text-stone-900">
                    {user?.name || (isAdmin ? 'Admin' : 'Student')}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl bg-stone-100 text-xs font-bold text-stone-800"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl bg-stone-900 text-xs font-bold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
