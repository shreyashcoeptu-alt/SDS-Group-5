import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  UserCheck,
  AlertCircle 
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email.trim(), password);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');

      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'cafeteria_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setErrorMessage('');
    if (role === 'customer') {
      setEmail('customer@student.com');
      setPassword('Customer@123');
      showToast('Loaded Demo Customer credentials', 'info');
    } else if (role === 'admin') {
      setEmail('admin@cafeteria.com');
      setPassword('Admin@123');
      showToast('Loaded Demo Cafeteria Admin credentials', 'info');
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '2rem auto',
      width: '100%'
    }}>
      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#0F0F11',
            color: '#FFFFFF',
            marginBottom: '1rem',
          }}>
            <LogIn size={22} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your cafeteria account
          </p>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="demo-box">
          <div className="demo-title">
            <Sparkles size={13} /> Quick Demo Logins:
          </div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-chip"
              onClick={() => fillDemo('customer')}
            >
              <UserCheck size={14} color="#1D4ED8" />
              <span>Customer Account</span>
            </button>
            <button
              type="button"
              className="demo-chip"
              onClick={() => fillDemo('admin')}
            >
              <ShieldCheck size={14} color="#7E22CE" />
              <span>Cafeteria Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'var(--badge-danger-bg)',
            border: '1px solid var(--badge-danger-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            color: 'var(--badge-danger-text)',
            fontSize: '0.86rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={17} />
              </span>
              <input
                id="login-email"
                type="email"
                className="custom-input"
                placeholder="you@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={17} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="custom-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '0.75rem' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={17} />
                <span>Sign In</span>
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
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary)' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
