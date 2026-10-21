import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Clock, 
  UtensilsCrossed, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent Member';

  return (
    <div className="animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(2, 132, 199, 0.08) 100%), #131a29',
        border: '1px solid rgba(234, 88, 12, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-customer">
              <ShoppingBag size={13} /> Customer Portal
            </span>
            <span className="badge badge-status-active">
              <CheckCircle2 size={13} /> Account {user?.status || 'Active'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Manage your cafeteria account credentials, profile settings, and view connected campus dining modules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/profile" className="btn btn-primary">
            <User size={16} />
            Edit Profile & Security
          </Link>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon secondary">
            <User size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Full Name</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              ID: {user?.id?.substring(0, 8)}...
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Mail size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Registered Email</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', wordBreak: 'break-all' }}>
              {user?.email}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '2px' }}>
              Verified JWT Session
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <Phone size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Phone Contact</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '600', color: '#fff' }}>
              {user?.phone || 'Not provided'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              SMS Notifications
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon admin">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Member Since</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '600', color: '#fff' }}>
              {formattedDate}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Campus Cafeteria System
            </div>
          </div>
        </div>
      </div>

      {/* Team Architecture & Teammate Integration Status */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', marginBottom: '0.25rem' }}>Cafeteria Services Ecosystem</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Live integration status of cafeteria team modules
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Student 1 Card (Current) */}
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="badge badge-status-active">Student 1 • LIVE & ACTIVE</span>
              <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '600' }}>JWT Protected</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Authentication & User Management</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
              Secure registration, login, bcrypt password hashing, token verification, and role-based access control.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              Endpoints: <code>/api/auth/login</code>, <code>/api/users/profile</code>
            </div>
          </div>

          {/* Student 2 Card (Teaser) */}
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="badge badge-customer">Student 2 • Menu Management</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Ready for Merge</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Daily Menu & Food Catalog</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
              Browse hot meals, snacks, and beverages with categorized prices and instant availability indicators.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              Stub Mount: <code>/api/menu</code> (Ready for Student 2)
            </div>
          </div>

          {/* Student 3 Card (Teaser) */}
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="badge" style={{ background: 'var(--primary-light)', color: '#fb923c' }}>Student 3 • Cart & Orders</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Ready for Merge</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Cart & Order Placement</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
              Add items to your meal tray, configure quantities, calculate real-time totals, and place food orders.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              Stub Mount: <code>/api/cart</code> (Ready for Student 3)
            </div>
          </div>

          {/* Student 4 Card (Teaser) */}
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--admin-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="badge badge-admin">Student 4 • Tracking & Staff</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Ready for Merge</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Live Order Status & History</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
              Track preparation status from kitchen to pickup counter with live stage updates and past receipt history.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              Stub Mount: <code>/api/orders</code> (Ready for Student 4)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
