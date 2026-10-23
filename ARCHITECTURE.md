# The Lunchroom: Architecture

The Lunchroom is a college lunch ordering website with a customer side, a kitchen side, an admin side, and a payment gateway (Razorpay). This file describes how the repository is laid out, who owns which part, and how the parts talk to each other.

---

## 1. Repository Layout

```
the-lunchroom/
├── .gitignore
├── README.md
├── ARCHITECTURE.md
├── package.json             Monorepo root scripts
├── backend/                 Node.js + Express + Mongoose
│   ├── package.json
│   ├── .env.example
│   ├── server.js            App entry point (mounts /api/auth, /api/menu, /api/orders, /api/payment)
│   ├── config/
│   │   └── db.js            MongoDB Atlas connection
│   ├── models/              User, MenuItem, Order schemas
│   ├── controllers/         Business logic per domain
│   ├── middleware/          JWT authentication & role-based access control
│   ├── routes/
│   │   ├── authRoutes.js    Student 1 auth endpoints
│   │   ├── menuRoutes.js    Student 2 menu endpoints
│   │   ├── orderRoutes.js   Student 3 & 4 order endpoints
│   │   └── paymentRoutes.js Sherwin payment endpoints
│   └── utils/
│       └── seed.js          Menu data seeder
├── frontend/                React + Tailwind CSS (Vite)
│   ├── package.json
│   ├── vite.config.js       Configured with @ -> ./src and @shared -> ../shared
│   ├── .env.example
│   └── src/
│       ├── routes/          AppRouter and route guards
│       ├── components/      Shared UI primitives (Button, Modal, Drawer, Switch, Toast)
│       ├── theme/           Theme tokens, provider, and picker
│       ├── api/             Shared Axios client
│       ├── utils/           Formatters, API path constants
│       ├── styles/          Tailwind entry, fonts, CSS variables
│       └── features/        Feature modules
│           ├── auth/        Login, register, profile, AuthContext
│           ├── cart/        Cart drawer, item quantities, checkout flow
│           ├── menu/        Customer menu, filters, admin menu manager, item form
│           └── orders/      Order history, live tracking, kitchen board, dashboard
└── shared/                  Plain JS constants used by both sides
    ├── index.js
    └── constants/
        ├── roles.js         customer, admin, staff
        ├── menu.js          Categories, constraints, validation limits
        └── orders.js        Order status & payment status enums
```

### Code Folder Boundaries

| Folder | What lives there | Who may import from it |
|---|---|---|
| `backend/` | API, database models, payment verification | Nothing outside `backend/` except `shared/` |
| `frontend/` | Everything the browser runs | `shared/` through the `@shared` alias |
| `shared/` | Constants and rules that must be identical on both sides (roles, menu limits, order statuses) | Both `backend/` and `frontend/` |

`shared/` holds dependency-free ES-module JavaScript only. If a value is needed by both the API and the UI, it is defined in `shared/` once.

---

## 2. People and Ownership

| Person | Role | Owns |
|---|---|---|
| **Shreyash Kadam** | Frontend Lead (Student 2) | `frontend/`: student ordering interface, admin menu manager, kitchen live order board, shared UI primitives |
| **Shantanu Mahajan** | Database & Data Layer | `backend/models/`, `backend/config/db.js`, `backend/utils/seed.js`, query helpers, Atlas pooling and indexes |
| **Sarthak Ghadage** | Core Backend & API Routing | `backend/routes/` for auth, menu, cart validation and orders; the API contract with the frontend |
| **Sherwin Advant** | Payments & Order Lifecycle | Payment endpoints (`/create-order`, `/verify-payment`), signature verification, error logging, order status updates through Shantanu's models |

`shared/` is edited by whoever needs a new constant. Notify team members in pull requests.

---

## 3. Feature Map

Each feature has a designated backend area and a frontend folder so work rarely overlaps:

| Feature | Owner | Backend Area | Frontend Folder |
|---|---|---|---|
| **Authentication & user management** | Student 1 | `routes/authRoutes.js`, `models/User.js` | `frontend/src/features/auth/` |
| **Menu & food management** | Student 2 (Shreyash) | `routes/menuRoutes.js`, `models/MenuItem.js` | `frontend/src/features/menu/` |
| **Cart & order placement** | Student 3 | `routes/orderRoutes.js` (`POST /`), `models/Order.js` | `frontend/src/features/cart/` |
| **Order tracking & admin dashboard** | Student 4 | `routes/orderRoutes.js` (`GET`, `PATCH`), dashboard summaries | `frontend/src/features/orders/` |
| **Payments** | Sherwin | `routes/paymentRoutes.js` | Checkout step inside `frontend/src/features/cart/` |

---

## 4. Frontend Architecture

### Feature-Based Folders
Everything specific to a feature lives under `frontend/src/features/<feature>/`:

```
features/<feature-name>/
├── api/          Network calls and the mock backend for this feature
├── components/   UI used only by this feature
├── hooks/        Data and state hooks for this feature
├── pages/        Route-level screens
└── index.js      Exports the pages and their route config
```

### Architectural Rules
- **Layering**: Pages compose components. Components never call the network directly.
- **API Boundary**: Only a feature's `api/` folder talks to the backend or mock service.
- **Shared Primitives**: Generic UI elements (`Button`, `Modal`, `Drawer`, `Switch`, `Toast`, `Badge`) live in `src/components/ui/`.
- **Isolation**: Features do not import from each other. If two features need the same logic, it moves to `src/components/`, `src/utils/`, or `shared/`.
- **Styling**: Colours strictly derive from theme tokens. No hard-coded hex values in component files.

### Screens and Routes

| Route | Screen | Who Sees It | Feature |
|---|---|---|---|
| `/menu` | Menu with category tabs, search, filters | Customer / Public | `menu` |
| `/admin/menu` | Menu manager (item creation, edit, toggle availability) | Cafeteria Admin | `menu` |
| `/login`, `/register` | Sign in and sign up | Everyone (Guest) | `auth` |
| `/cart`, `/checkout` | Cart review, item quantity adjust, payment trigger | Customer | `cart` |
| `/orders`, `/orders/:id` | Order history and live progress tracker | Customer | `orders` |
| `/kitchen` | Live order board for preparation and fulfillment | Admin / Kitchen Staff | `orders` |
| `/admin` | Dashboard and revenue/order summaries | Cafeteria Admin | `orders` |

### Theming
Four flat-colour themes are available via CSS variables on `<html data-theme="...">`, mapped to Tailwind tokens:
- **Locker**: Bold collegiate navy, energetic orange, warm off-white canvas.
- **Pistachio**: Calm bakery green, soft sage, cream tones.
- **Strawberry Milk**: Playful retro cafeteria pink, strawberry crimson, soft cream.
- **Blackboard**: High-contrast matte charcoal, chalk white, electric yellow accents.

The user's theme selection is persisted in `localStorage` under `lunchroom:theme`. All app-related `localStorage` keys use the `lunchroom:` namespace.

### Mock Mode vs. Real API
While the backend is in progress, setting `VITE_USE_MOCKS=true` causes each feature's `api/` layer to utilize an in-browser storage layer (`localStorage`) with realistic network latency simulation (200–400ms). Setting `VITE_USE_MOCKS=false` and pointing `VITE_API_URL` to `http://localhost:5000` routes requests directly to Express.

### Integration Stubs
The menu module functions standalone and provides two clean integration points for remaining features:
- `useCurrentUser()`: Stubs authentication context until Student 1's auth provider is connected.
- `onAdd(item)` on `FoodCard`: Stubs cart addition until Student 3's `useCart().addItem` is plugged in.

---

## 5. Backend Architecture

- **`server.js`**: Initializes Express, connects to MongoDB via `config/db.js`, mounts API routes under `/api`, sets CORS, and provides central error handling.
- **`models/`**: Defines Mongoose schemas for `User`, `MenuItem`, and `Order`. All database operations route through these models.
- **`routes/`**: Slim route definition files that validate inputs, route through auth/role middleware, and invoke controller logic.
- **`utils/seed.js`**: Populates the database with initial menu items for local testing.
- **Security & Payments**: Payment verification uses server-side HMAC-SHA256 signature checks with Razorpay's secret key. The frontend never verifies payment signatures directly.

---

## 6. Data Models and API Contracts

### MenuItem Model (`backend/models/MenuItem.js`)

```javascript
{
  _id: ObjectId,
  name: String,            // 2 to 60 characters, required, trimmed
  category: String,        // 'breakfast' | 'meals' | 'snacks' | 'beverages' | 'desserts'
  price: Number,           // Min 0, up to 2 decimal places
  description: String,     // Max 200 characters, trimmed
  image: String,           // URL string, optional
  isVeg: Boolean,          // Default: true
  isAvailable: Boolean,    // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### User Model (`backend/models/User.js`)

```javascript
{
  _id: ObjectId,
  name: String,            // Min 2 characters, required
  email: String,           // Valid email format, unique, lowercase
  password: String,        // Min 6 characters, required, select: false
  role: String,            // 'customer' | 'admin' | 'staff', default: 'customer'
  phone: String,           // Optional, trimmed
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model (`backend/models/Order.js`)

```javascript
{
  _id: ObjectId,
  orderNumber: String,     // Unique alphanumeric order identifier (e.g. "LR-1042")
  customer: ObjectId,      // Reference to User model, required
  items: [
    {
      menuItem: ObjectId,  // Reference to MenuItem model
      name: String,        // Snapshot of item name at time of order
      price: Number,       // Snapshot of item price at time of order
      quantity: Number,    // Minimum 1
      subtotal: Number     // price * quantity
    }
  ],
  totalAmount: Number,     // Total order price, min: 0
  status: String,          // 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  paymentStatus: String,   // 'pending' | 'paid' | 'failed'
  paymentId: String,       // Razorpay payment ID reference
  specialInstructions: String, // Up to 250 characters
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints Matrix

#### Menu Endpoints (`/api/menu`)
| Method & Path | Access | Purpose |
|---|---|---|
| `GET /api/menu` | Public | List all menu items with category & availability filter |
| `POST /api/menu` | Admin | Create a new menu item |
| `PUT /api/menu/:id` | Admin | Update item details (name, price, category, etc.) |
| `PATCH /api/menu/:id/availability` | Admin | Toggle item availability (`{ isAvailable: boolean }`) |
| `DELETE /api/menu/:id` | Admin | Delete a menu item |

#### Authentication Endpoints (`/api/auth`)
| Method & Path | Access | Purpose |
|---|---|---|
| `POST /api/auth/register` | Public | Register new customer account |
| `POST /api/auth/login` | Public | Authenticate user & issue JWT |
| `GET /api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `POST /api/auth/logout` | Authenticated | Clear user session / token |

#### Order Endpoints (`/api/orders`)
| Method & Path | Access | Purpose |
|---|---|---|
| `POST /api/orders` | Customer | Place new order with cart items and instructions |
| `GET /api/orders/my-orders` | Customer | Retrieve customer order history |
| `GET /api/orders/:id` | Customer / Admin | Get detailed status of a single order |
| `GET /api/orders` | Admin / Staff | List all active orders for kitchen board & dashboard |
| `PATCH /api/orders/:id/status` | Admin / Staff | Advance order state (`pending` → `preparing` → `ready` → `completed`) |

#### Payment Endpoints (`/api/payment`)
| Method & Path | Access | Purpose |
|---|---|---|
| `POST /api/payment/create-order` | Customer | Create Razorpay order ID for checkout session |
| `POST /api/payment/verify-payment` | Customer | Verify HMAC-SHA256 signature and mark order `paid` |

---

## 7. How the Pieces Work Together

1. **Browsing the Menu**:
   The browser calls `GET /api/menu`. `menuRoutes.js` queries `MenuItem.find()` and returns active items. The frontend filters, searches, and groups by category client-side with debounced search.
2. **Marking a Dish Sold Out**:
   An admin toggles the availability switch in `/admin/menu`. The frontend optimizes with optimistic UI updates, sending `PATCH /api/menu/:id/availability`. If the backend call fails, the switch rolls back and displays a toast error.
3. **Placing & Paying for an Order**:
   The customer proceeds through `/cart`. The frontend calls `POST /api/payment/create-order` to generate a Razorpay order. Upon successful payment in the Razorpay modal, the frontend sends `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` to `POST /api/payment/verify-payment`. The backend verifies the signature using the server secret key, creates the `Order` record, marks `paymentStatus: 'paid'`, and emits the order to the kitchen.
4. **Kitchen Fulfillment**:
   Kitchen staff on `/kitchen` see incoming orders categorized by `pending`, `preparing`, and `ready`. Clicking the action button advances the state via `PATCH /api/orders/:id/status`, updating the customer's `/orders/:id` status live.

---

## 8. Roles & Permissions

Defined once in `shared/constants/roles.js`:

| Role | Key | Permissions |
|---|---|---|
| **Customer** | `'customer'` | Browse menu, customize cart, checkout, view personal order history, live track own orders |
| **Kitchen Staff** | `'staff'` | View live kitchen queue, update order statuses (`preparing`, `ready`, `completed`) |
| **Cafeteria Admin** | `'admin'` | All customer & staff capabilities, plus menu CRUD, pricing updates, availability switches, and sales summaries |

The backend enforces role guards via `middleware/auth.js`. The frontend adapts the navigation and route access as a convenience.

---

## 9. Environment Variables

### Frontend (`frontend/.env.example`)
```bash
VITE_API_URL=http://localhost:5000
VITE_USE_MOCKS=true
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Backend (`backend/.env.example`)
```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lunchroom?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

Real `.env` files are in `.gitignore` and are never committed.

---

## 10. Running Locally

### Monorepo Root (Recommended)
```bash
npm run install:all     # Install dependencies in both backend and frontend
npm run dev:server      # Starts Express backend on http://localhost:5000
npm run dev:client      # Starts Vite React frontend on http://localhost:5173
```

### Separate Terminals
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

---

## 11. Architecture Alignment & Status of Previous Questions

All open questions have been validated against the active codebase:

1. **Repository Layout Confirmed**:
   The active folders are `backend/` and `frontend/`. Root scripts map to these folders.
2. **Route File Names & API Paths Confirmed**:
   `authRoutes.js`, `menuRoutes.js`, `orderRoutes.js`, and `paymentRoutes.js` are matched and mounted in `server.js`.
3. **Schemas Confirmed**:
   `User.js`, `MenuItem.js`, and `Order.js` are fully declared in `backend/models/`.
4. **Frontend Feature Directories Confirmed**:
   `features/auth`, `features/cart`, `features/menu`, and `features/orders` are established in `frontend/src/features/`.
5. **Shared Package Initialization**:
   `shared/` provides centralized constants for roles, menu constraints, and order states, imported cleanly into `frontend` via `@shared` and into `backend` via direct require.
