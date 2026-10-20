# Campus Bites — College Cafeteria Ordering System
### Software Development Section (SDS) — Group 5 Collaborated Project

A full-stack modern web application built to digitize and elevate college cafeteria dining. Customers can discover dishes with real-time dietary tags and live meal-slot recommendations, place orders, and track order progress; cafeteria administrators and kitchen staff manage menus, pricing, availability toggles, and incoming order fulfillment.

---

## 👥 Team Collaboration & Feature Ownership

| Student / Developer | Feature Module & Responsibility | Domain |
|---|---|---|
| **Student 1** | **Authentication & User Management**<br>Registration, login, password hashing, JWT sessions, role management (`customer` vs `admin`) | `client/src/features/auth/`<br>`server/routes/authRoutes.js` |
| **Student 2 (Shreyash & AI Antigravity)** | **Menu & Food Management**<br>Digital customer menu, category tabs, debounced search, veg/non-veg filters, admin menu manager, inline availability switch, bulk actions, drawer form | `client/src/features/menu/`<br>`server/routes/menuRoutes.js` |
| **Student 3** | **Cart & Order Placement**<br>Cart drawer, item quantities, total calculation in ₹, checkout form, Razorpay online payments & cash on counter | `client/src/features/cart/`<br>`server/routes/orderRoutes.js` |
| **Student 4** | **Order Tracking & Admin Dashboard**<br>Order history, live step-by-step order tracker, kitchen staff live queue, admin sales summaries | `client/src/features/orders/`<br>`server/routes/orderRoutes.js` |
| **Shantanu** | **Database Architecture & Seeding**<br>MongoDB connection, Mongoose schemas (`User`, `MenuItem`, `Order`), seed data script | `server/config/db.js`<br>`server/models/*`<br>`server/utils/seed.js` |
| **Sarthak & Sherwin** | **API Routing & Controllers**<br>Express server setup, route endpoints, error handling middleware | `server/server.js`<br>`server/routes/*` |

> 📖 **Detailed Architecture:** For the complete system design, Mermaid sequence diagrams, data schemas, and API contracts, see [ARCHITECTURE.md](file:///Users/shreyash/Desktop/SDS-Group-5/ARCHITECTURE.md).

---

## 🛠️ Technology Stack

- **Frontend (`client/`):**
  - **Framework:** React 18 + Vite (SPA)
  - **Styling:** Tailwind CSS with custom warm cafeteria tokens (`brand-600`, `cafe-bg`, `cafe-text`)
  - **Typography:** Bricolage Grotesque (headings), Plus Jakarta Sans (body UI), JetBrains Mono (prices)
  - **Icons:** Lucide React
  - **Routing:** React Router v6
  - **HTTP:** Axios with JWT interceptors
- **Backend (`server/`):**
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
├── client/                         # React 18 + Tailwind Frontend
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
│           ├── auth/               # Student 1: Authentication & User Profile
│           ├── menu/               # Student 2: Menu & Food Management (Shreyash)
│           ├── cart/               # Student 3: Cart & Checkout
│           └── orders/             # Student 4: Tracking & Admin Dashboard
└── server/                         # Node.js + Express Backend
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

### 1. Running the Frontend (`client/`)

```bash
cd client
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173/`**.

> **Note on Mock Mode**: By default, `VITE_USE_MOCKS=true` in `client/.env`. The frontend runs completely standalone with 20 pre-seeded authentic Indian dishes, persistent localStorage edits, and a floating **DEV ROLE SWITCHER** pill to toggle between Customer (`/menu`) and Admin (`/admin/menu`).

### 2. Running the Backend (`server/`)

```bash
cd server
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

In `client/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCKS=false
```
Restart `npm run dev` in `client/`.

---

## 🍱 Student 2: Menu & Food Management Showcase

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
