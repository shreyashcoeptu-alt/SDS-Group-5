# Menu & Food Management (Feature Module) — Student 2

Welcome to the **Menu & Food Management** module of the college Cafeteria Ordering System (`client/src/features/menu/`). This self-contained module powers both the customer-facing digital menu catalog and the administrative cafeteria menu manager.

---

## 1. What This Module Does

### Customer Experience (`/menu`)
- **Hero & Dayparting Strip**: Dynamic greeting tailored to the time of day (Breakfast, Lunch & Thali, Snacks & Evening Chai, Dinner) with Indian date formatting and live service indicator.
- **Sticky Category Navigation**: Smooth horizontal category scrolling (`All`, `Breakfast`, `Meals`, `Snacks`, `Beverages`, `Desserts`) with dynamic item count badges.
- **Instant Search & Dietary Filters**:
  - Real-time search with 250ms debouncing over dish names and descriptions.
  - Indian FSSAI veg / non-veg dietary toggle buttons (Veg only with green dot, Non-veg with red dot).
  - Multi-criteria sorting: Recommended, Price: Low to High, Price: High to Low, Name: A to Z.
  - "Show sold-out items" toggle (off by default to avoid cluttering; on renders them greyed out with a clear "Sold Out" badge).
  - Active URL query parameter synchronization (`?category=Meals&diet=veg&q=paneer`) for shareable, bookmarkable deep links.
- **Rich Food Cards**: High-resolution dish photography with graceful fallback illustrations, 2-line clamped descriptions, Indian Rupee (`₹`) formatting via `Intl.NumberFormat('en-IN')`, and tactile Add button feedback.
- **Item Detail Modal**: Accessible dialog with large photo preview, full ingredients/preparation description, dietary classification, and quick Add to Order button.
- **States**: Skeleton card placeholders during fetch, friendly empty search states with quick filter reset, and network error state with retry.

### Admin Experience (`/admin/menu`)
- **Metric Summary Chips**: Real-time counts of Total Items, Available (In Stock), Sold Out, and Distinct Food Categories with tabular figure styling.
- **Management Toolbar**: Instant search, category filter, availability status filter (All, In Stock Only, Sold Out Only), and view switcher (Desktop Table vs. Card Grid).
- **Responsive Table & Card Grid**:
  - In-place thumbnail previews with placeholder fallbacks.
  - Sortable table columns (Dish Name, Category, Price) with directional indicator arrows.
  - Inline optimistic **Availability Switch** with live spinning indicator and rollback on failure.
  - Row edit button (opens Drawer) and Delete button (opens Confirm Dialog).
- **Add / Edit Drawer Form**:
  - Right-side slide-over drawer (desktop) / modal (mobile).
  - Dish Name (2–60 chars validation).
  - Category picker with **inline "+ Create New Category"** option.
  - Price in ₹ (> 0, max 2 decimal places).
  - Description (up to 200 chars with live character counter).
  - Image URL with **live photo preview** and fallback error indicator.
  - Veg / Non-Veg custom radio selector with FSSAI compliant iconography.
  - Available toggle switch (default ON).
  - Inline validation feedback, disabled submission during in-flight save, and success toast notifications.
- **Delete Confirmation Modal**: Accessible dialog explicitly naming the dish (`"Are you sure you want to delete 'Masala Dosa'?"`) to prevent accidental data loss.
- **Bulk Operations**: Multi-row selection checkbox to batch mark dishes as Available or Sold Out.
- **RoleGate Protection**: Automatic redirection / access barrier for non-admin users with a polite unauthorized screen.

---

## 2. Route Map

| Path | Component | Access Level | Description |
|---|---|---|---|
| `/menu` | `<MenuPage />` | Public / Customer | Customer menu browsing, filtering, search & dish details |
| `/admin/menu` | `<MenuManagerPage />` | Admin Only (`RoleGate`) | Cafeteria inventory management, pricing, & availability |
| `/` | `Navigate to /menu` | Public | Automatic redirect to customer menu |

---

## 3. Switching Between Mock Mode and Real API

The frontend is completely decoupled and can run either in **standalone mock mode** or against the **real Node.js / Express / MongoDB backend**.

### Environment Variables (`client/.env`)

```bash
# 1. Base URL pointing to the Express backend (Sarthak's routes)
VITE_API_URL=http://localhost:5000/api

# 2. Mock mode toggle:
#    true  => Uses localStorage + in-memory store with simulated 400-700ms network latency
#    false => Makes real HTTP calls via Axios to VITE_API_URL
VITE_USE_MOCKS=true
```

To switch to the live backend:
1. Set `VITE_USE_MOCKS=false` in `client/.env`.
2. Ensure your backend server is running on `http://localhost:5000`.
3. Restart the Vite dev server (`npm run dev`).

---

## 4. Teammate Integration Stubs (To Replace on Merge)

This feature is modularized so other teammates can plug in their work with minimal touchpoints.

### A. Authentication (Student 1)
- **File**: `client/src/features/menu/hooks/useCurrentUser.js`
- **Current Behavior**: Provides a demo user and role state (`admin` or `customer`) with a floating **Dev Role Switcher** pill on the screen.
- **On Merge**:
  1. Replace `useCurrentUser.js` with your central `AuthContext` or `useAuth()` hook.
  2. Ensure the hook returns `{ user, isAdmin }` where `isAdmin = user.role === 'admin'`.
  3. The `RoleGate` component in `client/src/features/menu/components/RoleGate.jsx` will immediately work without changes.

### B. Cart & Order Placement (Student 3)
- **Files**:
  - `client/src/features/menu/pages/MenuPage.jsx` (`handleAddToCart`)
  - `client/src/features/menu/components/FoodCard.jsx` (`onAdd` prop)
  - `client/src/features/menu/components/FoodDetailModal.jsx` (`onAdd` prop)
- **Current Behavior**: Displays a success toast notification: `"Added [Dish Name] to order (demo)"`.
- **On Merge**:
  In `client/src/features/menu/pages/MenuPage.jsx`:
  ```javascript
  // Replace handleAddToCart with:
  import { useCart } from '@/features/cart'; // Student 3's cart hook

  const { addItem } = useCart();
  const handleAddToCart = (item) => {
    addItem(item);
  };
  ```

### C. Router Merging
- **File**: `client/src/routes/AppRouter.jsx`
- **On Merge**: Simply import your feature routes and register them alongside `menuRoutes`:
  ```javascript
  import { menuRoutes } from '@/features/menu';
  import { authRoutes } from '@/features/auth'; // Student 1
  import { cartRoutes } from '@/features/cart'; // Student 3
  import { orderRoutes } from '@/features/orders'; // Student 4
  ```

---

## 5. Backend Contract & Schema Specifications

For **Shantanu** (MongoDB Mongoose Schema) and **Sarthak** (Express Route Handlers):

### MongoDB `MenuItem` Schema (`server/models/MenuItem.js`)

```javascript
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than zero'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isVeg: {
      type: Boolean,
      required: true,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
```

### API Endpoints Specification (`server/routes/menuRoutes.js`)

All endpoints are prefixed with `/api`. Configured in `client/src/utils/constants.js`:

| Method | Endpoint | Authorization | Request Body | Response Body |
|---|---|---|---|---|
| `GET` | `/api/menu` | Public | None | `Array<MenuItem>` (or `{ success: true, data: Array<MenuItem> }`) |
| `POST` | `/api/menu` | Admin (`Bearer <token>`) | `{ name, category, price, description, image, isVeg, isAvailable }` | Created `MenuItem` object |
| `PUT` | `/api/menu/:id` | Admin (`Bearer <token>`) | `{ name, category, price, description, image, isVeg, isAvailable }` | Updated `MenuItem` object |
| `PATCH` | `/api/menu/:id/availability` | Admin (`Bearer <token>`) | `{ isAvailable: boolean }` | Updated `MenuItem` object |
| `DELETE` | `/api/menu/:id` | Admin (`Bearer <token>`) | None | `{ success: true, id: string }` |

---

## 6. Verification and Testing

1. Run the development server:
   ```bash
   cd client
   npm run dev
   ```
2. Open `http://localhost:5173/menu` in your browser.
3. Test customer capabilities:
   - Filter by categories (`Breakfast`, `Meals`, `Snacks`, `Beverages`, `Desserts`).
   - Search for dishes (`paneer`, `dosa`, `chai`).
   - Toggle `Veg Only` and `Non-Veg` filters.
   - Click any dish card to inspect the full detail modal.
   - Toggle "Show sold-out items" to reveal unavailable items.
4. Test admin capabilities:
   - Click the floating **DEV ROLE SWITCHER** pill in the bottom-left to switch to Admin mode.
   - Click the **Admin** button to open `/admin/menu`.
   - Toggle the availability of any dish — observe optimistic UI and check the customer view to verify it reflects.
   - Click **Add New Dish** to open the drawer; test inline category creation, validation, live image preview, and creation.
   - Click **Edit** on a dish; update price or name.
   - Click **Delete**; confirm with the dialog.
   - Select multiple rows via checkboxes and use the **Bulk Action Bar** to mark multiple dishes in stock or sold out at once.
