import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Home as HomeIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{
        width: '72px',
        height: '72px',
        margin: '0 auto 1.5rem',
        borderRadius: '20px',
        background: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Coffee size={36} />
      </div>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-dim)', maxWidth: '450px', margin: '0 auto 2rem' }}>
        The dining route you are looking for does not exist or has been relocated.
      </p>
      <Link to="/" className="btn btn-primary">
        <HomeIcon size={16} />
        <span>Return Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
