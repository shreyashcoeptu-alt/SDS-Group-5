
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ROLES, STORAGE_KEYS } from '@/utils/constants';

/**
 * Cafeteria Admin Login Page for The Lunchroom
 * Restricted portal for cafeteria staff and administrators.
 */
export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Validate form inputs.
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your admin email address';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!password) {
      newErrors.password = 'Please enter your admin password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle admin form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          studentId: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid admin credentials.');
      }

      const token = data.token;
      const adminData = data.user || data.student;
      const userRole = adminData?.role;

      // Never allow login without a valid user, token, and admin role.
      if (
        !adminData ||
        !token ||
        (userRole !== 'cafeteria_admin' && userRole !== 'admin')
      ) {
        throw new Error(
          'Access Denied: Only cafeteria administrators and staff can sign in here.'
        );
      }

      // Save admin session and JWT token.
      localStorage.setItem(
        STORAGE_KEYS.AUTH_DEMO_ROLE,
        ROLES.ADMIN
      );

      localStorage.setItem(
        'lunchroom:admin_email',
        email.trim()
      );

      localStorage.setItem(
        'cafeteria_token',
        token
      );

      localStorage.setItem(
        'cafeteria_user',
        JSON.stringify(adminData)
      );

      localStorage.setItem(
        'lunchroom:logged_in_at',
        new Date().toISOString()
      );

      // Notify active listeners.
      window.dispatchEvent(new Event('role_changed'));

      const displayName = adminData.name || 'Cafeteria Manager';

      toast.success(
        `Welcome back, ${displayName}! Kitchen and menu management tools are ready.`,
        'Admin Signed In'
      );

      navigate('/admin/menu', { replace: true });
    } catch (err) {
      setAuthError(
        err.message ||
          'Authentication failed. Please verify your admin credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill admin demo credentials.
  const handleQuickFillAdmin = () => {
    setEmail('admin@cafeteria.com');
    setPassword('Admin@123');
    setErrors({});
    setAuthError(null);

    toast.info(
      'Loaded Cafeteria Admin credentials',
      'Admin Quick Fill'
    );
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FDFCFB] text-stone-900 flex flex-col justify-between relative select-none font-sans">

      {/* Background curves */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full text-purple-200/40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            d="M -100,260 C 240,120 480,380 820,180 C 1140,-10 1380,240 1600,120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.6"
          />

          <path
            d="M -60,620 C 320,480 620,780 1020,540 C 1320,360 1480,680 1650,560"
            fill="none"
            stroke="#F3E8FF"
            strokeWidth="2"
            opacity="0.85"
          />

          <path
            d="M 280,-40 C 420,240 180,560 480,820 C 680,1020 980,940 1280,1100"
            fill="none"
            stroke="#F3E8FF"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Floating food illustrations */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0"
        aria-hidden="true"
      >
        <div
          className="hidden lg:block absolute left-[7%] top-[12%] animate-food-float-b"
          style={{ '--rot': '-12deg' }}
        >
          <img
            src="/images/food/tomato.png"
            alt=""
            className="w-20 xl:w-24 h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] opacity-95"
            loading="eager"
          />
        </div>

        <div
          className="hidden md:block absolute right-[5%] xl:right-[11%] top-[8%] xl:top-[11%] animate-food-float-c"
          style={{ '--rot': '4deg' }}
        >
          <img
            src="/images/food/momos.png"
            alt=""
            className="w-36 md:w-44 xl:w-52 h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] opacity-95"
            loading="eager"
          />
        </div>

        <div
          className="hidden md:block absolute left-[3%] xl:left-[8%] top-[48%] -translate-y-1/2 animate-food-float-a"
          style={{ '--rot': '-6deg' }}
        >
          <img
            src="/images/food/burger.png"
            alt=""
            className="w-44 md:w-52 xl:w-64 h-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.14)]"
            loading="eager"
          />
        </div>

        <div
          className="hidden md:block absolute right-[3%] xl:right-[7%] top-[54%] -translate-y-1/2 animate-food-float-b"
          style={{ '--rot': '12deg' }}
        >
          <img
            src="/images/food/pizza-slice.png"
            alt=""
            className="w-36 md:w-44 xl:w-56 h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]"
            loading="eager"
          />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        <Link to="/menu" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-sm shadow-purple-200 transition-transform group-hover:scale-105">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex items-baseline">
            <span className="font-heading font-black text-lg sm:text-2xl text-stone-900 tracking-tight group-hover:text-[#7C3AED] transition-colors">
              The Lunchroom
            </span>
          </div>
        </Link>

        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Student Portal</span>
        </Link>
      </header>

      {/* Admin login card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10 w-full max-w-full">
        <div className="w-full max-w-[440px] mx-auto">

          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-purple-100 shadow-[0_20px_50px_-15px_rgba(124,58,237,0.08),0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-sm">

            {/* Admin badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-heading font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cafeteria Staff Access</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-[26px] font-heading font-bold text-stone-900 tracking-tight leading-snug">
              Kitchen & Menu Control
            </h1>

            <p className="text-stone-500 text-xs sm:text-sm mt-2 leading-relaxed font-sans">
              Sign in with managerial credentials to update live stock, toggle item availability, and control menus.
            </p>

            {/* Authentication error */}
            {authError && (
              <div
                className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Admin form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-5 sm:mt-6 flex flex-col gap-4"
            >

              {/* Admin email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-email"
                  className="text-xs font-heading font-semibold text-stone-900 uppercase tracking-wider"
                >
                  Admin Email
                  <span className="text-purple-600 ml-1">*</span>
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>

                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (errors.email) {
                        setErrors((prev) => ({
                          ...prev,
                          email: null,
                        }));
                      }
                    }}
                    placeholder="admin@cafeteria.com"
                    className={`
                      w-full bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border h-11 pl-10 pr-3.5
                      transition-all duration-150 focus:outline-none shadow-sm
                      ${
                        errors.email
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                          : 'border-stone-200 hover:border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
                      }
                    `}
                  />
                </div>

                {errors.email && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Admin password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-password"
                  className="text-xs font-heading font-semibold text-stone-900 uppercase tracking-wider"
                >
                  Admin Password
                  <span className="text-purple-600 ml-1">*</span>
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (errors.password) {
                        setErrors((prev) => ({
                          ...prev,
                          password: null,
                        }));
                      }
                    }}
                    placeholder="••••••••"
                    className={`
                      w-full bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border h-11 pl-10 pr-11
                      transition-all duration-150 focus:outline-none shadow-sm
                      ${
                        errors.password
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                          : 'border-stone-200 hover:border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-2 w-full h-12 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6]
                  text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider
                  flex items-center justify-center gap-2 shadow-sm shadow-purple-200
                  transition-all duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2
                "
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Authenticating Admin...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Enter Management Dashboard</span>
                  </>
                )}
              </button>

              {/* Admin demo autofill */}
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="text-[11px] text-purple-600 hover:text-purple-800 font-medium py-1 transition-colors flex items-center justify-center gap-1 mt-1"
                title="Populate test admin credentials"
              >
                <CheckCircle2 className="w-3 h-3 text-purple-500" />
                <span>
                  Quick fill Admin demo (admin@cafeteria.com / Admin@123)
                </span>
              </button>

              {/* Student portal link */}
              <div className="mt-3 pt-3.5 border-t border-stone-100 text-center">
                <Link
                  to="/login"
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Are you a student? Sign in to Student Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-xs text-stone-400">
          The Lunchroom &copy; {new Date().getFullYear()} &bull; Cafeteria Staff & Administration Console
        </p>
      </footer>
    </div>
  );
};

export default AdminLoginPage;
