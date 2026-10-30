import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  ShoppingBag,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    adminSecretKey: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      adminSecretKey: role === 'cafeteria_admin' ? '' : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (formData.role === 'cafeteria_admin' && !formData.adminSecretKey.trim()) {
      setErrorMessage('Admin Security Key is required for Cafeteria Staff registration.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        adminSecretKey: formData.adminSecretKey.trim(),
      });

      toast.success(`Account created successfully! Welcome to The Lunchroom, ${newUser.name}.`, 'Welcome');

      if (newUser.role === 'cafeteria_admin' || newUser.role === 'admin') {
        navigate('/admin/orders', { replace: true });
      } else {
        navigate('/menu', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
      toast.error(err.message || 'Registration failed', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full mx-auto my-auto pt-4 pb-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-black text-2xl tracking-tight text-stone-900">
              Join The Lunchroom
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Create an account to order fresh campus food
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Toggle */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('customer')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    formData.role === 'customer'
                      ? 'border-[#E23744] bg-rose-50/50 text-[#E23744] font-bold shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-xs">Student / Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('cafeteria_admin')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    formData.role === 'cafeteria_admin'
                      ? 'border-[#E23744] bg-rose-50/50 text-[#E23744] font-bold shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs">Cafeteria Admin</span>
                </button>
              </div>
            </div>

            {/* Admin Key (If Admin Selected) */}
            {formData.role === 'cafeteria_admin' && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  name="adminSecretKey"
                  value={formData.adminSecretKey}
                  onChange={handleChange}
                  placeholder="Enter staff security key"
                  className="w-full h-10 px-3 bg-white text-stone-900 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@college.edu"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 chars"
                    className="w-full h-11 pl-10 pr-8 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-[#E23744] hover:bg-[#CE2835] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4 shadow-sm shadow-rose-200 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-stone-500 mt-5 pt-4 border-t border-stone-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#E23744] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

