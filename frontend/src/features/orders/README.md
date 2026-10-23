# Order Tracking & Admin Dashboard (Student 4)

This folder is reserved for **Student 4**'s frontend implementation.

## Scope
- Customer Order History page (`/orders`)
- Live Order Status tracking page (`/orders/:id`) with step indicators (`pending` -> `preparing` -> `ready` -> `completed`)
- Kitchen Live Order Board (`/admin/orders`) for cafeteria staff
- Order Status update buttons (e.g. Mark as Preparing, Mark as Ready)
- Admin Sales summary & Order totals dashboard (`/admin/dashboard`)

## Integration with Student 2 (Menu)
- Orders reference dishes from `MenuItem` (`menuItem._id`, `name`, `price`).
- Common design system tokens (`colors`, `fonts`, `Badge`, `Button`, `Modal`) in `client/src/components/ui/` can be reused directly to maintain visual harmony.
