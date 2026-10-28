# The Lunchroom — Integration Notes & Audit Report
**Date:** October 28, 2026  
**Integration Lead:** Antigravity (SDS Group 5)  
**Target Branch:** `integration/the-lunchroom`

---

## 1. Executive Summary
All four student features plus Razorpay test payment processing have been successfully integrated into a cohesive, production-ready full-stack application called **The Lunchroom**.
- Student 1 (Auth): Full JWT authentication, bcrypt hashing, role guards (`customer`, `admin`/`cafeteria_admin`), `AuthContext`, register & login pages.
- Student 2 (Menu & Food Management): Full CRUD backend with `MenuItem` Mongoose model, availability toggling, local high-res dish photos, and search/filter interface.
- Student 3 (Cart & Orders): Persistent reactive cart with `CartContext`, quantity modifiers, slide-over drawer, and MongoDB order creation.
- Student 4 (Order Tracking & Dashboard): Live order tracking stepper, kitchen fulfillment queue for cafeteria staff, and sales summary analytics.
- Payments: Seamless Razorpay test modal integration (`/create-order` and `/verify-payment` HMAC-SHA256 signature verification).
- Zero-Config Database: Automatic embedded in-memory MongoDB fallback with pre-seeded demo users and dishes if no external MongoDB daemon is running.

---

## 2. Feature-by-Feature Integration Source Matrix

| Feature | Student Owner | Source Branch / Commit | Components & Files Integrated |
| :--- | :--- | :--- | :--- |
| **Authentication & User Management** | Student 1 (Sarthak) | `origin/sarthak_dev` | `backend/controllers/authController.js`<br>`backend/models/User.js`<br>`backend/routes/authRoutes.js`<br>`backend/utils/generateToken.js`<br>`backend/middleware/auth.js`<br>`frontend/src/context/AuthContext.jsx`<br>`frontend/src/pages/Register.jsx`<br>`frontend/src/features/auth/pages/LoginPage.jsx`<br>`frontend/src/features/auth/pages/AdminLoginPage.jsx` |
| **Menu & Food Management** | Student 2 (Shreyash) | `shreyash_dev` + `backup/local-before-integration` | `backend/models/MenuItem.js`<br>`backend/controllers/menuController.js`<br>`backend/routes/menuRoutes.js`<br>`backend/utils/seed.js`<br>`frontend/public/images/menu/` (12 dish photos)<br>`frontend/src/features/menu/pages/MenuPage.jsx`<br>`frontend/src/features/menu/pages/MenuManagerPage.jsx` |
| **Cart & Order Placement** | Student 3 (Shantanu) | `main` (`origin/shantanu_dev`) | `frontend/src/features/cart/CartContext.jsx`<br>`frontend/src/features/cart/CartDrawer.jsx`<br>`backend/models/Order.js`<br>`backend/routes/orderRoutes.js` (POST `/api/orders`) |
| **Order Tracking & Admin Dashboard** | Student 4 (Sherwin) | `main` (`origin/sherwindev`) | `frontend/src/features/orders/pages/CustomerOrdersPage.jsx`<br>`frontend/src/features/orders/pages/OrderTrackingPage.jsx`<br>`frontend/src/features/orders/pages/AdminOrdersDashboardPage.jsx`<br>`backend/routes/orderRoutes.js` (GET `/orders`, PATCH `/status`, GET `/summary`) |
| **Payments Gateway** | Payments (Sherwin) | `main` | `backend/routes/paymentRoutes.js`<br>`frontend/src/features/cart/CartDrawer.jsx` (Razorpay checkout handler) |

---

## 3. Conflicts Encountered & How They Were Resolved

1. **Unrelated Git Histories on `sarthak_dev`:**
   - **Conflict:** Sarthak's branch was force-updated with a distinct commit graph that caused Git to reject raw merges with `fatal: refusing to merge unrelated histories`.
   - **Resolution:** Surgically extracted Sarthak's complete authentication controllers, models, and token utilities directly into `integration/the-lunchroom`, and connected them with The Lunchroom's shared styling and route architecture.

2. **Role Enum Discrepancy Across Teammates:**
   - **Conflict:** Student 1's model used `cafeteria_admin` and `student`, while Student 3/4's order routes and middlewares checked `admin`, `staff`, and `customer`.
   - **Resolution:** Updated `shared/constants.js`, `backend/models/User.js`, and `backend/middleware/auth.js` to normalize both conventions (`admin` $\equiv$ `cafeteria_admin` $\equiv$ `staff`, and `customer` $\equiv$ `student`), guaranteeing full interoperability across all frontend and backend checks.

3. **Backend Port Conflict on macOS (Port 5000):**
   - **Conflict:** macOS ControlCenter AirPlay Receiver occupies port 5000 by default (`commplex-main`), throwing `EADDRINUSE`.
   - **Resolution:** Set backend port to `5001` in `backend/.env`, configured Vite reverse proxy in `frontend/vite.config.js` (`/api` $\rightarrow$ `http://localhost:5001`), and updated `VITE_API_URL` to `http://localhost:5001/api`.

4. **External MongoDB Daemon Dependency:**
   - **Conflict:** Running locally failed if the developer did not have an active `mongod` background process on port 27017.
   - **Resolution:** Added an embedded in-memory MongoDB auto-fallback via `mongodb-memory-server` in `backend/config/db.js`. If an external MongoDB is detected, it connects normally; if not, it boots an in-memory database and auto-seeds initial dishes and test users so the app runs out-of-the-box.

---

## 4. Components Built from Scratch to Complete Integration
1. **`shared/constants.js`:** Single source of truth for Roles, Order Statuses, and Menu Limits shared across both frontend and backend.
2. **`frontend/src/components/Navbar.jsx`:** Unified responsive navigation header displaying The Lunchroom wordmark, role-specific buttons ("Menu", "Cart (N)", "My orders" for students; "Menu manager", "Incoming orders", "View as student" for admins), student name, and logout.
3. **`frontend/src/features/auth/pages/RegisterPage.jsx`:** Full registration screen matching the editorial design of `LoginPage.jsx` with student vs cafeteria admin role selection.
4. **`frontend/src/components/ProtectedRoute.jsx`:** Strict role-aware route protection preventing students from opening admin pages, redirecting unauthenticated users to `/login`, and directing users to their respective home pages upon login.
5. **`frontend/src/services/api.js`:** Consolidated Axios-based authentication client for `authAPI.login`, `authAPI.register`, and `authAPI.getMe`.

---

## 5. Verification & Testing Results
- **Syntax Checks:** `node -c` passed across all backend files, models, controllers, routes, and seed scripts.
- **Frontend Production Build:** `npm run build` completed in 1.22s with zero warnings or errors.
- **End-to-End API Integration:**
  - Health check: HTTP 200 OK
  - Live Menu fetch: 12 dishes returned
  - Student Login (`aarav.cs23@college.edu`): HTTP 200 OK, JWT returned
  - Admin Login (`admin@cafeteria.com`): HTTP 200 OK, JWT returned
  - Razorpay order creation (`/api/payment/create-order`): HTTP 200 OK, Order ID generated
  - Order placement (`/api/orders`): HTTP 201 Created with order number
  - Live tracking (`/api/orders/:id`): HTTP 200 OK
  - Admin status transition (`PATCH /api/orders/:id/status`): Status changed to `preparing`
  - Stock availability toggle (`PATCH /api/menu/:id/availability`): Dish toggled sold out
