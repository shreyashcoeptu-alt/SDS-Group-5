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
