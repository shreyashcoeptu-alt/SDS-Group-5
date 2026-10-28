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

// Lightweight request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root Health Check & Team Architecture API Overview
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    project: 'Smart Cafeteria Management Platform',
    teamModules: {
      student1: {
        feature: 'Authentication & User Management',
        endpoints: ['/api/auth', '/api/users'],
      },
      student2: {
        feature: 'Menu & Food Management',
        endpoints: ['/api/menu'],
      },
      student3_and_4: {
        feature: 'Orders, Payments & Tracking',
        endpoints: ['/api/orders', '/api/payment'],
      },
    },
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);       // Student 1
app.use('/api/users', userRoutes);      // Student 1 (if created)
app.use('/api/menu', menuRoutes);       // Student 2
app.use('/api/orders', orderRoutes);    // Student 3 & 4
app.use('/api/payment', paymentRoutes); // Student 3

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
  console.log(`🚀 Cafeteria Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});

module.exports = app;