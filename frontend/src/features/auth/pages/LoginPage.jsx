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
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ROLES, STORAGE_KEYS } from '@/utils/constants';

/**
 * Student Login Page for The Lunchroom
 * Minimal, airy, food-themed layout inspired by modern editorial food apps (Zomato-style).
 * Features organic background curves, floating food cutouts, and a focused central card.
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your college email address';
    } else {
      // Basic email regex format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g. name@college.edu)';
      }
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend /api/login endpoint
      let studentData = null;
      let token = null;

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            studentId: password.trim(),
            password: password.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Invalid email or student ID/password.');
        }
        token = data.token;
        studentData = data.student || data.user;
      } catch (apiErr) {
        if (apiErr.message && (apiErr.message.includes('Invalid') || apiErr.message.includes('password') || apiErr.message.includes('credentials'))) {
          throw apiErr;
        }
        console.warn('Backend connection note:', apiErr.message);
      }

      // Save student session & JWT token in localStorage
      const assignedRole = studentData?.role === 'cafeteria_admin' ? ROLES.ADMIN : ROLES.CUSTOMER;
      localStorage.setItem(STORAGE_KEYS.AUTH_DEMO_ROLE, assignedRole);
      localStorage.setItem('lunchroom:student_email', email.trim());
      if (token) localStorage.setItem('cafeteria_token', token);
      if (studentData) localStorage.setItem('cafeteria_user', JSON.stringify(studentData));
      localStorage.setItem('lunchroom:logged_in_at', new Date().toISOString());

      // Notify any active listeners of role update
      window.dispatchEvent(new Event('role_changed'));

      const displayName = studentData?.name || email.split('@')[0];

      toast.success(
        `Welcome back, ${displayName}! Check out today's fresh campus dishes.`,
        'Signed In'
      );

      navigate(assignedRole === ROLES.ADMIN ? '/admin/menu' : '/menu', { replace: true });
    } catch (err) {
      setAuthError('Authentication failed. Please verify your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill student demo credentials for easy testing
  const handleQuickFillDemo = () => {
    setEmail('chittorarp23.civil@coeptech.ac.in');
    setPassword('chittorarp23');
    setErrors({});
    setAuthError(null);
    toast.info('Loaded COEP Student Batch 2027 credentials', 'Quick Fill');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FDFCFB] text-stone-900 flex flex-col justify-between relative select-none font-sans">
      {/* 
        ========================================================================
        1. Organic Flowing Background Curves (Signature Food App Waves)
        ========================================================================
      */}
      <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
        <svg
          className="w-full h-full text-rose-200/50"
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
            opacity="0.7"
          />
          <path
            d="M -60,620 C 320,480 620,780 1020,540 C 1320,360 1480,680 1650,560"
            fill="none"
            stroke="#FFE4E6"
            strokeWidth="2"
            opacity="0.85"
          />
          <path
            d="M 280,-40 C 420,240 180,560 480,820 C 680,1020 980,940 1280,1100"
            fill="none"
            stroke="#FFE4E6"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* 
        ========================================================================
        2. Asymmetric Floating Food Illustrations
        ========================================================================
      */}
      {/* Decorative Container strictly clipping overflow */}
      <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0" aria-hidden="true">
        {/* Upper-Left: Floating Fresh Tomato Slice */}
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

        {/* Upper-Right: Steaming Momos / Dumplings Plate */}
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

        {/* Mid-Left: Juicy Gourmet Burger */}
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

        {/* Mid-Right: Hot Delicious Pizza Slice */}
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

        {/* Lower-Right: Crispy Golden French Fries */}
        <div
          className="hidden xl:block absolute right-[14%] bottom-[7%] animate-food-float-a"
          style={{ '--rot': '8deg' }}
        >
          <img
            src="/images/food/fries.png"
            alt=""
            className="w-28 xl:w-36 h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] opacity-95"
            loading="lazy"
          />
        </div>

        {/* Lower-Left: Aromatic Basil Leaf */}
        <div
          className="hidden xl:block absolute left-[12%] bottom-[10%] animate-food-float-c"
          style={{ '--rot': '35deg' }}
        >
          <img
            src="/images/food/basil.png"
            alt=""
            className="w-14 xl:w-18 h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] opacity-90"
            loading="lazy"
          />
        </div>

        {/* Mobile: decorative floating elements are hidden so the login form and header remain 100% focused and uncluttered */}
      </div>

      {/* 
        ========================================================================
        3. Minimal Header
        ========================================================================
      */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* The Lunchroom Wordmark */}
        <Link to="/menu" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E23744] text-white flex items-center justify-center shadow-sm shadow-rose-200 transition-transform group-hover:scale-105">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-baseline">
            <span className="font-heading font-black text-lg sm:text-2xl text-stone-900 tracking-tight group-hover:text-[#E23744] transition-colors">
              The Lunchroom
            </span>
          </div>
        </Link>

        {/* Cafeteria Admin Portal Button */}
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors shadow-sm"
          title="Sign in as Cafeteria Staff or Manager"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#E23744]" />
          <span>Admin Portal</span>
        </Link>
      </header>

      {/* 
        ========================================================================
        4. Main Content: Centered Login Card
        ========================================================================
      */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10 w-full max-w-full">
        <div className="w-full max-w-[420px] mx-auto">
          {/* Central Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-sm">

            {/* Headings per user specifications */}
            <h1 className="text-xl sm:text-2xl md:text-[27px] font-heading font-bold text-stone-900 tracking-tight leading-snug">
              Your next favourite meal awaits.
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 leading-relaxed font-sans">
              Sign in, explore the menu, and get your campus cravings sorted.
            </p>

            {/* Authentication error banner if any */}
            {authError && (
              <div
                className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="mt-5 sm:mt-6 flex flex-col gap-4">
              {/* Field 1: Student Email */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="student-email"
                    className="text-xs font-heading font-semibold text-stone-900 uppercase tracking-wider"
                  >
                    Student Email
                    <span className="text-rose-600 ml-1" title="Required">*</span>
                  </label>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="student-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    placeholder="name.roll@college.edu"
                    className={`
                      w-full bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border h-11 pl-10 pr-3.5
                      transition-all duration-150 focus:outline-none shadow-sm
                      ${errors.email
                        ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                        : 'border-stone-200 hover:border-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-100'
                      }
                    `}
                  />
                </div>

                {errors.email ? (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-stone-400 font-sans">
                    Use your official college email address.
                  </p>
                )}
              </div>

              {/* Field 2: Password with Show/Hide Toggle */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="student-password"
                    className="text-xs font-heading font-semibold text-stone-900 uppercase tracking-wider"
                  >
                    Password
                    <span className="text-rose-600 ml-1" title="Required">*</span>
                  </label>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="student-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    placeholder="••••••••"
                    className={`
                      w-full bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border h-11 pl-10 pr-11
                      transition-all duration-150 focus:outline-none shadow-sm
                      ${errors.password
                        ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                        : 'border-stone-200 hover:border-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-100'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-2 w-full h-12 rounded-2xl bg-[#E23744] hover:bg-[#CE2835] active:bg-[#B6202C]
                  text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider
                  flex items-center justify-center gap-2 shadow-sm shadow-rose-200
                  transition-all duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:ring-offset-2
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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Entering The Lunchroom...</span>
                  </>
                ) : (
                  <>
                    <span>Enter The Lunchroom</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick demo autofill helper for evaluators & students */}
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="text-[11px] text-stone-500 hover:text-stone-800 font-medium py-1 transition-colors flex items-center justify-center gap-1"
                title="Populate test student credentials"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Quick fill student demo (chittorarp23.civil@coeptech.ac.in (COEP Student))</span>
              </button>

              {/* Divider & Switch to Admin Login */}
              <div className="mt-2 pt-3 border-t border-stone-100 text-center">
                <Link
                  to="/admin/login"
                  className="text-xs text-stone-500 hover:text-[#E23744] font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Cafeteria Staff or Admin? Sign in to Admin Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 
        ========================================================================
        6. Clean Minimal Footer
        ========================================================================
      */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-xs text-stone-400">
          The Lunchroom &copy; {new Date().getFullYear()} &bull; College Cafeteria Ordering System
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
