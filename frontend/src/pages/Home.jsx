import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Coffee, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowRight, 
  UtensilsCrossed, 
  ShoppingBag, 
  ClipboardList, 
  CheckCircle2,
  Lock,
  Zap,
  Clock,
  HeartHandshake
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 1rem 4rem',
        maxWidth: '920px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.95rem',
          borderRadius: 'var(--radius-full)',
          background: '#F3F4F6',
          border: '1px solid #E5E7EB',
          color: 'var(--text-main)',
          fontSize: '0.8rem',
          fontWeight: '600',
          fontFamily: 'var(--font-mono)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Zap size={14} color="#0F0F11" fill="#0F0F11" />
          The Lunchroom • Smart Campus Dining
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          letterSpacing: '-0.03em',
          color: 'var(--text-main)'
        }}>
          Delicious Food, Faster Service at{' '}
          <span style={{
            background: 'linear-gradient(135deg, #0F0F11 0%, #27272A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            borderBottom: '3px solid #EA580C'
          }}>The Lunchroom</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          The official campus cafeteria management system. Experience secure user accounts, instant role privileges, pre-ordering capabilities, and real-time counter updates.
        </p>

        {/* Call to Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <Link to={isAdmin ? '/admin' : '/customer'} className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <span>Go to {isAdmin ? 'Admin Console' : 'Customer Portal'}</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                <span>Sign In to The Lunchroom</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                <span>Create New Account</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Modern Cafeteria Highlights (No Student 1,2,3,4 section) */}
      <section style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            Everything You Need for Campus Dining
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Built for students, faculty, and cafeteria kitchen staff
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Secure Accounts */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="stat-icon" style={{ marginBottom: '1.25rem' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0.35rem 0 0.65rem' }}>
              Secure Authentication & Roles
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Encrypted credentials with bcrypt password hashing, JWT sessions, and differentiated roles for campus patrons and cafeteria administration staff.
            </p>
          </div>

          {/* Card 2: Fresh Daily Menu */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="stat-icon secondary" style={{ marginBottom: '1.25rem' }}>
              <UtensilsCrossed size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0.35rem 0 0.65rem' }}>
              Daily Menu Catalog
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Explore hot meal options, daily specials, healthy snacks, and beverages with categorized pricing and real-time kitchen availability tags.
            </p>
          </div>

          {/* Card 3: Quick Orders */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', marginBottom: '1.25rem' }}>
              <ShoppingBag size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0.35rem 0 0.65rem' }}>
              Quick Cart & Checkout
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Customize your tray, adjust meal item quantities, calculate instantaneous totals, and avoid waiting in long noon lunch lines.
            </p>
          </div>

          {/* Card 4: Kitchen Order Tracking */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="stat-icon admin" style={{ marginBottom: '1.25rem' }}>
              <ClipboardList size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0.35rem 0 0.65rem' }}>
              Live Order Status
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Track preparation status from kitchen grill to pickup counter with instant status updates and past order history.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
