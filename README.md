<<<<<<< HEAD
# The Lunchroom — Smart Cafeteria Management Platform
=======
<<<<<<< HEAD
# CampusBite — Smart Cafeteria Management Platform
>>>>>>> main

A modern full-stack web application designed for campus cafeteria dining operations. Built with **React** (Frontend), **Node.js / Express** (Backend), and **MongoDB Atlas** (Database).

---

## 👥 Team Feature Ownership Matrix

| Member | Feature Scope | Status | Main Area |
| :--- | :--- | :--- | :--- |
| **Student 1 (You)** | **Authentication & User Management** | **✅ COMPLETE & ACTIVE** | `backend/controllers/authController.js`, `backend/routes/authRoutes.js`, `backend/routes/userRoutes.js`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`, `frontend/src/pages/AdminDashboard.jsx` |
| **Student 2** | **Menu & Food Management** | 🔄 Ready for Merge | `backend/routes/menuRoutes.js`, `backend/models/FoodItem.js` |
| **Student 3** | **Cart & Order Placement** | 🔄 Ready for Merge | `backend/routes/cartRoutes.js`, `backend/models/Cart.js` |
| **Student 4** | **Order Tracking & Admin Dashboard** | 🔄 Ready for Merge | `backend/routes/orderRoutes.js`, `backend/routes/adminDashboardRoutes.js` |

---

## 🔐 Student 1 — Implemented Features & Deliverables

### 1. User Registration & Login
- **Registration (`POST /api/auth/register`)**:
  - Full name, Email, Phone, Password, and Role selection.
  - Supports `customer` (Student / Patron) and `cafeteria_admin` (Cafeteria Staff / Manager).
  - Staff registration secured with an Admin Security Passkey (`CAFE_ADMIN_2026`).
- **Login (`POST /api/auth/login`)**:
  - Email and password verification.
  - Rejects inactive or suspended accounts.
  - Returns signed JWT token and user profile object.
- **Session Verification (`GET /api/auth/me`)**:
  - Verifies JWT in `Authorization: Bearer <token>` header and loads active user profile.
- **Logout (`POST /api/auth/logout`)**:
  - Safe client-side token disposal and backend notification.

### 2. Password Hashing & Security
- Uses **bcryptjs** with 10 salt rounds before persisting to MongoDB.
- Password hashes never exposed in normal queries (`select: false` and custom `toJSON` serialization).
- User password change endpoint (`PUT /api/users/change-password`) requiring old password verification.

### 3. JWT & Role-Based Access Control (RBAC)
- **JWT Signing**: Signs payload (`id`, `role`) with expiration (`JWT_EXPIRES_IN=1d`).
- **Middleware**:
  - `protect`: Validates `Bearer` JWT, handles expired/invalid tokens, checks account status.
  - `authorize(...roles)`: Enforces role permissions (e.g., `authorize('cafeteria_admin')`).

### 4. User Management Hub (Cafeteria Admin Only)
- **Summary Metrics (`GET /api/users/stats`)**: Total users, total customers, total admins, active/suspended count.
- **Search & Filter (`GET /api/users`)**: Search across names, emails, and phone numbers with role and status filters.
- **Role Toggle (`PUT /api/users/:id/role-status`)**: Promote/demote users (`customer` ↔ `cafeteria_admin`).
- **Account Suspension (`PUT /api/users/:id/role-status`)**: Activate/suspend user accounts.
- **Account Deletion (`DELETE /api/users/:id`)**: Remove user accounts with self-deletion protection.

### 5. Frontend UI (React + Vite)
- Modern design system with responsive layout, glassmorphism cards, and Google Fonts (Outfit & Plus Jakarta Sans).
- 1-Click Quick Demo Login buttons for evaluators and teammates.
- Customer Portal with profile overview and modular service roadmap.
- Cafeteria Admin Console with real-time stats cards and user management table.
- Self-service Profile & Password settings page.
- Real-time toast notifications for user actions.

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- Git

### 1. Backend Setup
```bash
cd backend
npm install
# Seed demo accounts (Customer & Cafeteria Admin)
npm run seed
# Start server
npm run dev
```
Backend runs on **http://localhost:5000**.
Run automated tests:
```bash
npm test
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**.

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Cafeteria Admin** | `admin@cafeteria.com` | `Admin@123` |
| **Customer (Student)** | `customer@student.com` | `Customer@123` |
| **Customer (Faculty)** | `samantha.lee@campus.edu` | `Customer@123` |
| **Customer (Staff)** | `marcus.chen@campus.edu` | `Customer@123` |

*Tip: On the `/login` page, you can click the **"Customer Account"** or **"Cafeteria Admin"** chips to auto-fill credentials instantly.*

---

## 🤝 Guide for Team Members (Student 2, 3, & 4)

To prevent merge conflicts and errors, the project has already been structured with modular route files:

1. **Student 2 (Menu & Food Management)**:
   - Create your food model in `backend/models/FoodItem.js`.
   - Implement your logic in `backend/controllers/menuController.js`.
   - Add your endpoints to `backend/routes/menuRoutes.js`.
   - Protect admin routes using:
     ```javascript
     const { protect, authorize } = require('../middleware/authMiddleware');
     router.post('/', protect, authorize('cafeteria_admin'), addFoodItem);
     ```

2. **Student 3 (Cart & Order Placement)**:
   - Create your models in `backend/models/Cart.js` and `backend/models/Order.js`.
   - Add your endpoints in `backend/routes/cartRoutes.js`.
   - Use `protect` to get the logged-in customer ID via `req.user._id`.

3. **Student 4 (Order Tracking & Admin Kitchen Dashboard)**:
   - Add order history and status update routes in `backend/routes/orderRoutes.js`.
   - Add staff dashboard metrics in `backend/routes/adminDashboardRoutes.js`.

---

## 🚀 How to Push to GitHub (Student 1 Branch)

Run the following commands in the project root (`cafeteria-management-system`):

```bash
# 1. Add your team's GitHub repository as the remote (replace with your repo URL)
git remote add origin https://github.com/<YOUR_ORGANIZATION_OR_USERNAME>/cafeteria-management-system.git

# 2. Verify you are on your feature branch
git branch
# You should see: * feature/student-1-auth

# 3. Push your feature branch to GitHub
git push -u origin feature/student-1-auth
```

Once pushed, open GitHub and click **"Compare & pull request"** to merge `feature/student-1-auth` into `main`!
=======
# The Lunchroom — College Cafeteria Ordering System
### Software Development Section (SDS) — Group 5 Project

**The Lunchroom** is a full-stack modern web platform built to digitize and elevate college cafeteria dining. Students and campus patrons can browse dishes with live vegetarian tags, dietary filters, and images; place orders into a persistent cart; complete orders via Razorpay test payment; and track order progress in real time through an interactive live status stepper. Cafeteria administrators and kitchen staff manage menus, pricing, stock availability toggles, and incoming order fulfillment.

---

> 📖 **Detailed Architecture:** For the complete system design, data schemas, roles, and API contracts, see [ARCHITECTURE.md](file:///Users/shreyash/Desktop/SDS-Group-5/ARCHITECTURE.md).

---

## 🛠️ Technology Stack

- **Frontend (`frontend/`):**
  - **Framework:** React 18 + Vite (SPA)
  - **Styling:** Tailwind CSS with flat editorial tokens (`#FDFCFB`, `#E23744`, `#0F0F11`)
  - **Typography:** Bricolage Grotesque / Clash Grotesk, Plus Jakarta Sans, JetBrains Mono
  - **Icons:** Lucide React
  - **Routing:** React Router v6 with Role-Based Protected Routes
  - **State & Context:** React Context API (`AuthContext`, `CartContext`, `ToastContext`)
  - **HTTP:** Axios with automatic JWT Authorization bearer interceptors
- **Backend (`backend/`):**
  - **Runtime:** Node.js + Express
  - **Database:** MongoDB + Mongoose ODM (Zero-config local embedded MongoDB fallback with auto-seeding + MongoDB Atlas support)
  - **Payments:** Razorpay Node SDK with HMAC-SHA256 signature verification
  - **Security:** JSON Web Tokens (JWT), Bcrypt.js, CORS
- **Shared (`shared/`):**
  - Centralized single-source-of-truth constants for Roles, Order Statuses, and Menu Limits.

---

## 👥 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Student / Customer** | `aarav.cs23@college.edu` | `lunchroom2026` | `/menu`, Cart, Checkout, `/orders` (Live Tracking) |
| **Cafeteria Admin** | `admin@cafeteria.com` | `Admin@123` | `/admin/orders` (Kitchen Queue), `/admin/menu` (Manager) |

*(Admins can also register at `/register` by selecting "Cafeteria Admin" and entering security key `CAFE_ADMIN_2026`).*

---

## 📁 Repository Structure

```
The Lunchroom/
├── .gitignore
├── README.md                       # Project overview & quick start
├── ARCHITECTURE.md                 # Full system architecture, API contracts & schemas
├── INTEGRATION_NOTES.md            # Integration report across all 4 student features
├── package.json                    # Monorepo root scripts
├── shared/
│   └── constants.js                # Roles, order statuses, and menu constraints
├── frontend/                       # React 18 + Tailwind Frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/images/menu/         # Local high-res cafeteria dish photos
│   └── src/
│       ├── App.jsx                 # App shell mounting AuthProvider, CartProvider, Navbar, Router
│       ├── components/
│       │   ├── Navbar.jsx          # Role-aware responsive navigation header
│       │   ├── ProtectedRoute.jsx  # Role & auth route protection
│       │   └── ui/                 # UI primitives (Button, Modal, Drawer, Toast, Badge)
│       ├── context/                # AuthContext (session, login, register, token)
│       ├── routes/AppRouter.jsx    # Unified router with public, customer, and admin groups
│       └── features/
│           ├── auth/               # LoginPage, RegisterPage, AdminLoginPage
│           ├── menu/               # Customer MenuPage, Admin MenuManagerPage, Cards, Forms
│           ├── cart/               # CartContext, CartDrawer, Razorpay checkout
│           └── orders/             # CustomerOrdersPage, OrderTrackingPage, AdminOrdersDashboardPage
└── backend/                        # Node.js + Express Backend
    ├── .env.example
    ├── package.json
    ├── server.js                   # Express server entry point (port 5001)
    ├── config/db.js                # MongoDB connection + Embedded local DB auto-fallback
    ├── controllers/                # authController, menuController
    ├── middleware/auth.js          # JWT verification & role authorization
    ├── models/                     # User, MenuItem, Order schemas
    ├── routes/                     # authRoutes, menuRoutes, orderRoutes, paymentRoutes
    └── utils/seed.js               # Database seeder (Dishes & demo accounts)
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Files
Copy the example environment files (configured for local operation out-of-the-box):
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Seed Database & Start
To seed dishes and demo accounts manually into MongoDB:
```bash
npm run seed --prefix backend
```

To run both backend and frontend concurrently:
```bash
# Terminal 1 - Backend API (starts on http://localhost:5001)
npm run dev:server

# Terminal 2 - Frontend Client (starts on http://localhost:5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser.
>>>>>>> 4eb5d73816d09ac1d7a828c517ba12a00bfea2e4
