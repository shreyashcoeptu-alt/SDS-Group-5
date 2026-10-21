# CampusBite — Smart Cafeteria Management Platform

A modular full-stack web application designed for campus cafeteria dining operations. Built with **React** (Frontend), **Node.js / Express** (Backend), and **MongoDB Atlas** (Database).

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
