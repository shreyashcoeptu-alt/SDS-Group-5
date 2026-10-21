import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Save, 
  KeyRound, 
  CheckCircle2, 
  Calendar,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    setProfileLoading(true);
    try {
      const res = await userAPI.updateProfile({ name: name.trim(), phone: phone.trim() });
      if (res.success && res.user) {
        updateUser(res.user);
        showToast('Profile information updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Please provide both current and new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please verify.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await userAPI.changePassword({ currentPassword, newPassword });
      showToast(res.message || 'Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Password change failed.');
      showToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Top Profile Header Card */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <div className={`avatar-circle ${isAdmin ? 'admin' : ''}`} style={{
          width: '84px',
          height: '84px',
          fontSize: '2rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
          {user?.name?.substring(0, 2).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{user?.name}</h1>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-customer'}`}>
              {isAdmin ? 'Cafeteria Admin' : 'Customer'}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={15} />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={15} />
                <span>{user?.phone}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} />
              <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} />
          <span>Profile Information</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <KeyRound size={16} />
          <span>Password & Security</span>
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Update Personal Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon"><User size={17} /></span>
                <input
                  id="profile-name"
                  type="text"
                  className="custom-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">
                <span>Email Address</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Primary Account ID (Read-only)</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"><Mail size={17} /></span>
                <input
                  id="profile-email"
                  type="email"
                  className="custom-input"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon"><Phone size={17} /></span>
                <input
                  id="profile-phone"
                  type="tel"
                  className="custom-input"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileLoading}
              style={{ marginTop: '0.75rem' }}
            >
              {profileLoading ? 'Saving Changes...' : (
                <>
                  <Save size={16} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Change Account Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Ensure your account is using a secure password hashed with <code>bcrypt</code>.
          </p>

          {passwordError && (
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
              <div>{passwordError}</div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="curr-pass">Current Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={17} /></span>
                <input
                  id="curr-pass"
                  type={showPassword ? 'text' : 'password'}
                  className="custom-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-pass">New Password (min 6 characters)</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={17} /></span>
                <input
                  id="new-pass"
                  type={showPassword ? 'text' : 'password'}
                  className="custom-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-pass">Confirm New Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={17} /></span>
                <input
                  id="confirm-pass"
                  type={showPassword ? 'text' : 'password'}
                  className="custom-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={passwordLoading}
              style={{ marginTop: '0.75rem' }}
            >
              {passwordLoading ? 'Updating Password...' : (
                <>
                  <KeyRound size={16} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
