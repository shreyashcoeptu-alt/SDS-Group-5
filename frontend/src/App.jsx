import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Protected Route */}
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Cafeteria Admin Protected Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['cafeteria_admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* General Protected Profile Route (Accessible by Customer & Admin) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer style={{
              borderTop: '1px solid var(--border-subtle)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              background: '#090d16'
            }}>
              <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <strong>The Lunchroom</strong> — Campus Cafeteria & Dining Platform
                </div>
                <div>
                  Node.js • Express • MongoDB Atlas • JWT • React
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
