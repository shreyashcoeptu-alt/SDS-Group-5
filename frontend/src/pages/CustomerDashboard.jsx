import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  UtensilsCrossed, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  Sparkles,
  Coffee
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
            Welcome to The Lunchroom, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Manage your personal cafeteria profile, security credentials, and dining preferences from your dashboard.
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
              Account Verified
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
              Secure JWT Session
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
              The Lunchroom
            </div>
          </div>
        </div>
      </div>

      {/* Cafeteria Dining Features (Clean, no student sections) */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '0.25rem' }}>Cafeteria Dining Highlights</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Enjoy hot meals, quick pre-orders, and express counter pickups
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
              <UtensilsCrossed size={20} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Fresh Daily Kitchen Specials</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: '1.5' }}>
              Chef specials prepared daily with local ingredients, vegetarian options, and nutritional tags.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: 'var(--secondary)' }}>
              <Clock size={20} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Skip The Noon Rush</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: '1.5' }}>
              Pre-order meals directly from your mobile device and pick them up at Counter B with zero wait times.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--admin-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: 'var(--admin-accent)' }}>
              <Coffee size={20} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Beverage & Snack Station</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: '1.5' }}>
              Espresso, iced cold brews, pastries, and healthy protein snacks available throughout the day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
