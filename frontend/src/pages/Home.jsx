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
  Zap
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
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(234, 88, 12, 0.1)',
          border: '1px solid rgba(234, 88, 12, 0.25)',
          color: '#fb923c',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} />
          Student 1 Module: Authentication & User Management Live
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
          fontWeight: '800',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          letterSpacing: '-0.03em'
        }}>
          The Intelligent Dining Platform for <span style={{
            background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 50%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Campus Life</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          A collaborative full-stack web application designed for campus cafeterias. Featuring secure JWT authentication, multi-role privileges (Customer & Cafeteria Admin), and ready-to-merge modular interfaces.
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
                <span>Sign In to Cafeteria</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                <span>Create New Account</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Architecture Matrix: 4 Students Breakdown */}
      <section style={{ marginTop: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            Multi-Student Collaborative Architecture
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Built modularly so every teammate can merge their backend and frontend features without git conflicts.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Student 1 Card */}
          <div className="glass-card" style={{
            padding: '2rem',
            border: '2px solid rgba(234, 88, 12, 0.4)',
            boxShadow: 'var(--shadow-glow)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'var(--success-light)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '0.2rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}>
              YOUR MODULE • ACTIVE
            </div>

            <div className="stat-icon" style={{ marginBottom: '1.25rem' }}>
              <ShieldCheck size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student 1 (Feature Owner)
            </div>
            <h3 style={{ fontSize: '1.35rem', margin: '0.35rem 0 0.75rem' }}>
              Authentication & User Management
            </h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>User registration & login</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Bcrypt password hashing & verification</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Authentication using JWT</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Roles: customer & cafeteria admin</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Protected routes & user management</span>
              </li>
            </ul>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
              Backend routes: <code>auth/</code>, <code>users/</code>
            </div>
          </div>

          {/* Student 2 Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="stat-icon secondary" style={{ marginBottom: '1.25rem' }}>
              <UtensilsCrossed size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student 2 (Feature Owner)
            </div>
            <h3 style={{ fontSize: '1.35rem', margin: '0.35rem 0 0.75rem' }}>
              Menu & Food Management
            </h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <li>• Display available food items</li>
              <li>• Add, edit, and delete menu items</li>
              <li>• Food categories, prices, & descriptions</li>
              <li>• Mark items available/unavailable</li>
              <li>• Admin menu management portal</li>
            </ul>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
              Backend routes: <code>menu/</code>, <code>food-items/</code>
            </div>
          </div>

          {/* Student 3 Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', marginBottom: '1.25rem' }}>
              <ShoppingBag size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student 3 (Feature Owner)
            </div>
            <h3 style={{ fontSize: '1.35rem', margin: '0.35rem 0 0.75rem' }}>
              Cart & Order Placement
            </h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <li>• Add food items to cart</li>
              <li>• Update quantities & remove items</li>
              <li>• Real-time price & tax calculation</li>
              <li>• Place new food orders</li>
              <li>• Save order details & line items</li>
            </ul>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
              Backend routes: <code>cart/</code>, <code>orders/</code>
            </div>
          </div>

          {/* Student 4 Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="stat-icon admin" style={{ marginBottom: '1.25rem' }}>
              <ClipboardList size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student 4 (Feature Owner)
            </div>
            <h3 style={{ fontSize: '1.35rem', margin: '0.35rem 0 0.75rem' }}>
              Order Tracking & Kitchen Admin
            </h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <li>• Customer order receipt history</li>
              <li>• Live order status tracking</li>
              <li>• Staff update status (Prep, Ready)</li>
              <li>• Kitchen incoming queue monitor</li>
              <li>• Basic order summaries & totals</li>
            </ul>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--surface-input)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
              Backend routes: <code>order-status/</code>, <code>admin-dashboard/</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
