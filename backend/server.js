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

// Root Health Check & Team Architecture API Overview
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'Smart Cafeteria Management Platform',
    teamModules: {
      student1: {
        feature: 'Authentication & User Management',
        status: 'COMPLETE & ACTIVE',
        endpoints: ['/api/auth/register', '/api/auth/login', '/api/auth/me', '/api/users/profile', '/api/users'],
      },
      student2: {
        feature: 'Menu & Food Management',
        status: 'Stub ready for Student 2',
        endpoints: ['/api/menu'],
      },
      student3: {
        feature: 'Cart & Order Placement',
        status: 'Stub ready for Student 3',
        endpoints: ['/api/cart'],
      },
      student4: {
        feature: 'Order Tracking & Admin Dashboard',
        status: 'Stub ready for Student 4',
        endpoints: ['/api/orders', '/api/admin-dashboard'],
      },
    },
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Modular Stubs for Team Members (Student 2, 3, 4)
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
  console.log(`🚀 Cafeteria Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Auth API:     http://localhost:${PORT}/api/auth`);
  console.log(`   Users API:    http://localhost:${PORT}/api/users`);
  console.log(`=================================================`);
});
