# Cart & Order Placement (Student 3)

This folder is reserved for **Student 3**'s frontend implementation.

## Scope
- Cart state management & `useCart()` hook
- Floating Cart drawer / drawer modal
- Quantity increment / decrement / item removal
- Subtotal, GST, and Total calculation in INR (₹)
- Checkout form (payment method: Online via Razorpay / Cash on Counter)
- API call to `POST /api/orders`

## Integration with Student 2 (Menu)
Student 2's `FoodCard` and `FoodDetailModal` both emit an `onAdd(item)` callback:
1. Export a `useCart` hook from `client/src/features/cart/index.js` with an `addItem(menuItem)` function.
2. In `client/src/features/menu/pages/MenuPage.jsx`, import `{ useCart } from '@/features/cart'` and call `addItem(item)` inside `handleAddToCart`.
