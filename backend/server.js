const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');

// Connect to MongoDB Database
connectDB();

const app = express();

// Core middlewares
app.use(cors({
  origin: '*', // Allow frontend Vite client (e.g. http://localhost:5173)
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root Health Check & System API Overview
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'The Lunchroom - Cafeteria Management Platform',
    modules: {
      auth: {
        feature: 'Authentication & User Management',
        status: 'ACTIVE',
        endpoints: ['/api/auth/register', '/api/auth/login', '/api/auth/me', '/api/users/profile', '/api/users'],
      },
      menu: {
        feature: 'Menu & Food Management',
        status: 'Mounted',
        endpoints: ['/api/menu'],
      },
      cart: {
        feature: 'Cart & Order Placement',
        status: 'Mounted',
        endpoints: ['/api/cart'],
      },
      orders: {
        feature: 'Order Tracking & Admin Dashboard',
        status: 'Mounted',
        endpoints: ['/api/orders', '/api/admin-dashboard'],
      },
    },
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Modular Stubs for Team Members
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin-dashboard', require('./routes/adminDashboardRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found on this server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 The Lunchroom Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Auth API:     http://localhost:${PORT}/api/auth`);
  console.log(`   Users API:    http://localhost:${PORT}/api/users`);
  console.log(`=================================================`);
});
