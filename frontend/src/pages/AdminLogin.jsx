import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertTriangle, 
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both admin email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email.trim(), password);

      // Verify that this user actually has cafeteria_admin role
      if (loggedUser.role !== 'cafeteria_admin') {
        await logout();
        const err = 'Access Denied: This account has student/customer permissions. Only authorized cafeteria administrators can access this portal.';
        setErrorMessage(err);
        showToast(err, 'error');
        setLoading(false);
        return;
      }

      showToast(`Welcome back, Administrator ${loggedUser.name}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Admin authentication failed. Please verify your credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setErrorMessage('');
    setEmail('admin@cafeteria.com');
    setPassword('Admin@123');
    setAdminKey('CAFE_ADMIN_2026');
    showToast('Loaded Demo Cafeteria Admin credentials', 'info');
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '2rem auto',
      width: '100%',
      padding: '0 1rem'
    }}>
      {/* Return to Customer Portal link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link 
          to="/login" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={15} />
          Back to Student & Customer Login
        </Link>
      </div>

      <div className="glass-card animate-fade-in" style={{ 
        padding: '2.5rem',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 85, 247, 0.08)'
      }}>
        {/* Header with Admin Shield Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.3))',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            marginBottom: '1rem',
            color: '#c084fc',
            boxShadow: '0 8px 20px rgba(147, 51, 234, 0.25)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <div style={{
            display: 'inline-block',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            background: 'rgba(147, 51, 234, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#d8b4fe',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            Staff & Manager Access
          </div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem', fontFamily: 'var(--font-display)' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Authorized Cafeteria Management & Kitchen Control
          </p>
        </div>

        {/* Security Warning Notice */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem',
          background: 'rgba(147, 51, 234, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: '#e9d5ff',
          marginBottom: '1.5rem',
          lineHeight: 1.45
        }}>
          <AlertTriangle size={16} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            Restricted area. All administrative operations, menu modifications, and user management events are audited.
          </div>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="demo-box" style={{ 
          marginBottom: '1.5rem',
          background: 'rgba(0,0,0,0.3)',
          borderColor: 'rgba(168, 85, 247, 0.2)'
        }}>
          <div className="demo-title" style={{ color: '#d8b4fe' }}>
            <Sparkles size={13} color="#c084fc" /> Quick Demo Admin:
          </div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-chip"
              onClick={fillDemoAdmin}
              style={{
                width: '100%',
                justifyContent: 'center',
                borderColor: 'rgba(168, 85, 247, 0.35)',
                background: 'rgba(147, 51, 234, 0.12)'
              }}
            >
              <ShieldCheck size={14} color="#c084fc" />
              <span>Fill Demo Cafeteria Admin (admin@cafeteria.com)</span>
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
            <AlertTriangle size={17} style={{ flexShrink: 0 }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              Admin Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={17} color="#a855f7" />
              </span>
              <input
                id="admin-email"
                type="email"
                className="custom-input"
                placeholder="admin@cafeteria.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ borderColor: 'rgba(168, 85, 247, 0.25)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Admin Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={17} color="#a855f7" />
              </span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="custom-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ borderColor: 'rgba(168, 85, 247, 0.25)' }}
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
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem',
              marginTop: '0.75rem',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="spinner-sm" /> Authenticating Admin...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogIn size={18} /> Enter Admin Control Panel
              </span>
            )}
          </button>
        </form>

        {/* Security Footer Details */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-dim)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={13} color="#10b981" />
            <span>256-bit JWT Encrypted</span>
          </div>
          <div>
            Role: <span style={{ color: '#c084fc', fontWeight: 600 }}>cafeteria_admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
