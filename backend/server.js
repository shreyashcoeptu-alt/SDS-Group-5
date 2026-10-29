const path = require('path');
// Load environment variables explicitly
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize database connection
connectDB();

const app = express();

// Core middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve dish photos statically so backend and direct requests can always access images
app.use('/images', express.static(path.resolve(__dirname, '../frontend/public/images')));

// Lightweight request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Database connectivity check for API routes
const mongoose = require('mongoose');
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is not ready. Please ensure your current IP address is whitelisted in MongoDB Atlas (Network Access -> Add 0.0.0.0/0 or Current IP).',
    });
  }
  next();
});

// Root Health Check & System API Overview
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    project: 'The Lunchroom - Cafeteria Management Platform',
    modules: {
      auth: {
        feature: 'Authentication & User Management',
        status: 'ACTIVE',
        endpoints: ['/api/auth', '/api/users'],
      },
      menu: {
        feature: 'Menu & Food Management',
        status: 'ACTIVE',
        endpoints: ['/api/menu'],
      },
      orders: {
        feature: 'Orders, Payments & Tracking',
        status: 'ACTIVE',
        endpoints: ['/api/orders', '/api/payment'],
      },
    },
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 The Lunchroom Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});

module.exports = app;