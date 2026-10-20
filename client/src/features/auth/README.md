# Authentication & User Management (Student 1)

This folder is reserved for **Student 1**'s frontend implementation.

## Scope
- User Registration & Login views
- AuthContext & `useAuth()` hook
- Token management (save JWT token to `localStorage.setItem('token', token)`)
- Customer & Admin role gates
- Profile & Logout button

## Integration with Student 2 (Menu)
Once your `AuthContext` is built:
1. Replace `client/src/features/menu/hooks/useCurrentUser.js` with your `useAuth()` hook.
2. Ensure the hook provides `{ user, isAdmin }` where `isAdmin = user.role === 'admin'`.
3. The `<RoleGate>` protecting `/admin/menu` will automatically consume your authenticated admin status.
