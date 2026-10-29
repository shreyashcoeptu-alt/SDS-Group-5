import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/features/cart';
import { useToast } from '@/components/ui/Toast';
import { ShoppingBag, Menu, X, ArrowLeft } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-stone-900 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <Link
              to={isAdmin ? '/admin/orders' : '/menu'}
              className="font-black text-xl sm:text-2xl tracking-tight text-stone-900 hover:opacity-90 flex items-center gap-2.5"
            >
              <img
                src="/images/TheLunchroomLogo.png"
                alt="The Lunchroom Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <span>The Lunchroom</span>
              {isAdmin && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-white ml-1">
                  Admin
                </span>
              )}
            </Link>
          </div>

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
                </Link>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                  aria-label="Open Cart"
                >
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
