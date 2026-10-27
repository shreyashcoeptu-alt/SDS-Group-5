# The Lunchroom — College Cafeteria Ordering System
### Software Development Section (SDS) — Group 5 Project

A full-stack modern web application built to digitize and elevate college cafeteria dining. Customers can discover dishes with real-time dietary tags and live meal-slot recommendations, place orders, and track order progress; cafeteria administrators and kitchen staff manage menus, pricing, availability toggles, and incoming order fulfillment.

---

> 📖 **Detailed Architecture:** For the complete system design, data schemas, roles, and API contracts, see [ARCHITECTURE.md](file:///Users/shreyash/Desktop/SDS-Group-5/ARCHITECTURE.md).

---

## 🛠️ Technology Stack

- **Frontend (`frontend/`):**
  - **Framework:** React 18 + Vite (SPA)
  - **Styling:** Tailwind CSS with custom warm cafeteria tokens (`brand-600`, `cafe-bg`, `cafe-text`)
  - **Typography:** Bricolage Grotesque (headings), Plus Jakarta Sans (body UI), JetBrains Mono (prices)
  - **Icons:** Lucide React
  - **Routing:** React Router v6
  - **HTTP:** Axios with JWT interceptors
- **Backend (`backend/`):**
  - **Runtime:** Node.js + Express
  - **Database:** MongoDB + Mongoose ODM
  - **Security:** JSON Web Tokens (JWT), Bcrypt.js, CORS
- **Mock Store (Standalone Mode):**
  - LocalStorage + In-memory store with realistic 400–700ms simulated latency for offline frontend development.

---

## 📁 Repository Structure

```
cafeteria-ordering-system/
├── .gitignore
├── README.md                       # Project overview & quick start
├── ARCHITECTURE.md                 # Full system architecture, API contracts & schemas
├── package.json                    # Monorepo root scripts (npm run dev, dev:frontend, dev:backend)
├── frontend/                       # React 18 + Tailwind Frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                 # App shell mounting ToastProvider, DevRoleSwitcher, Router
│       ├── api/axiosClient.js      # Shared Axios client
│       ├── components/ui/          # Shared atomic primitives (Button, Modal, Drawer, Switch, etc.)
│       ├── routes/AppRouter.jsx    # Feature routes registry
│       ├── styles/index.css        # Global CSS & Tailwind imports
│       ├── utils/                  # formatCurrency (₹), constants
│       └── features/
│           ├── auth/               # Authentication & User Profile
│           ├── menu/               # Menu & Food Management
│           ├── cart/               # Cart & Checkout
│           └── orders/             # Tracking & Admin Dashboard
└── backend/                        # Node.js + Express Backend
    ├── .env.example
    ├── package.json
    ├── server.js                   # Express server entry point
    ├── config/db.js                # MongoDB connection
    ├── middleware/auth.js          # JWT & role authorization middleware
    ├── models/                     # User, MenuItem, Order schemas
    ├── routes/                     # authRoutes, menuRoutes, orderRoutes, paymentRoutes
    └── utils/seed.js               # Database seeder (20 Indian cafeteria dishes)
```

---

## 🚀 Quick Start Guide

### Monorepo Quickstart (From Root)
```bash
npm run install:all     # Install dependencies for both backend and frontend
npm run dev             # Start the frontend dev server
npm run dev:backend     # Start the Express API server
```

### 1. Running the Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173/`**.

> **Note on Mock Mode**: By default, `VITE_USE_MOCKS=true` in `frontend/.env`. The frontend runs completely standalone with 20 pre-seeded authentic Indian dishes, persistent localStorage edits, and a floating **DEV ROLE SWITCHER** pill to toggle between Customer (`/menu`) and Admin (`/admin/menu`).

### 2. Running the Backend (`backend/`)

```bash
cd backend
npm install
# Copy environment configuration
cp .env.example .env
# Seed initial dishes into MongoDB
npm run seed
# Start the API server
npm run dev
```

The backend API will run on **`http://localhost:5000/api`**.

### 3. Connecting Frontend to Real Backend

In `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCKS=false
```
Restart `npm run dev` in `frontend/`.

---

## 🍱 Menu & Food Management Showcase

- **Customer Menu (`/menu`)**:
  - Time-of-day greeting (Breakfast, Lunch, Snacks, Dinner) with Indian date format.
  - Sticky category tabs (`All`, `Breakfast`, `Meals`, `Snacks`, `Beverages`, `Desserts`).
  - Search (debounced 250ms), FSSAI veg/non-veg filter toggle, multi-criteria sort, and sold-out toggle.
  - Interactive dish cards, Indian Rupee (`₹`) formatting, and full dish detail modal.
- **Admin Menu Manager (`/admin/menu`)**:
  - Metric summary chips (Total, Available, Sold Out, Categories).
  - Table view (desktop sortable columns) & Card Grid view (mobile).
  - Optimistic availability switch with live loading indicator and automatic error rollback.
  - Drawer form with inline category creation, live image URL preview, and validation.
  - Explicit delete confirmation modal and bulk selection actions.
  - Protected by `RoleGate`.
