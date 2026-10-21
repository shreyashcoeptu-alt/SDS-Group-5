import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  UserPlus, 
  ShieldCheck, 
  ShoppingBag,
  AlertCircle 
} from 'lucide-react';

const Register = () => {
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
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      adminSecretKey: role === 'cafeteria_admin' ? (prev.adminSecretKey || 'CAFE_ADMIN_2026') : '',
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

      showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');

      if (newUser.role === 'cafeteria_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto', width: '100%' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(234, 88, 12, 0.05))',
            color: 'var(--primary)',
            marginBottom: '1rem',
            border: '1px solid rgba(234, 88, 12, 0.25)'
          }}>
            <UserPlus size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join CampusBite to order food and manage services
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'var(--danger-light)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            color: '#f87171',
            fontSize: '0.86rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection Cards */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>
              Select Account Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => handleRoleSelect('customer')}
                style={{
                  padding: '1rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${formData.role === 'customer' ? 'var(--secondary)' : 'var(--border-subtle)'}`,
                  background: formData.role === 'customer' ? 'var(--secondary-light)' : 'var(--surface-input)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <ShoppingBag size={22} color={formData.role === 'customer' ? '#38bdf8' : '#94a3b8'} style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: formData.role === 'customer' ? '#38bdf8' : '#ffffff' }}>
                  Customer
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Student / Patron
                </div>
              </div>

              <div
                onClick={() => handleRoleSelect('cafeteria_admin')}
                style={{
                  padding: '1rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${formData.role === 'cafeteria_admin' ? 'var(--admin-accent)' : 'var(--border-subtle)'}`,
                  background: formData.role === 'cafeteria_admin' ? 'var(--admin-light)' : 'var(--surface-input)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <ShieldCheck size={22} color={formData.role === 'cafeteria_admin' ? '#c084fc' : '#94a3b8'} style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: formData.role === 'cafeteria_admin' ? '#c084fc' : '#ffffff' }}>
                  Cafeteria Admin
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Staff & Management
                </div>
              </div>
            </div>
          </div>

          {/* Admin Secret Key Field (Conditional) */}
          {formData.role === 'cafeteria_admin' && (
            <div className="form-group animate-fade-in" style={{
              background: 'var(--admin-light)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <label className="form-label" htmlFor="reg-admin-key" style={{ color: '#d8b4fe' }}>
                <span>Staff Security Passkey</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Default: CAFE_ADMIN_2026</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <KeyRound size={17} color="#c084fc" />
                </span>
                <input
                  id="reg-admin-key"
                  name="adminSecretKey"
                  type="text"
                  className="custom-input"
                  style={{ borderColor: 'rgba(139, 92, 246, 0.4)' }}
                  placeholder="Enter staff security key"
                  value={formData.adminSecretKey}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              Full Name *
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <User size={17} />
              </span>
              <input
                id="reg-name"
                name="name"
                type="text"
                className="custom-input"
                placeholder="e.g. Sarthak Ghadage"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Email Address *
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={17} />
              </span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="custom-input"
                placeholder="name@campus.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">
              Phone Number
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Phone size={17} />
              </span>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                className="custom-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password * (min 6 characters)
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={17} />
              </span>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="custom-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">
              Confirm Password *
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={17} />
              </span>
              <input
                id="reg-confirm-password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="custom-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus size={17} />
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.88rem',
          color: 'var(--text-muted)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '600', color: 'var(--primary)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
