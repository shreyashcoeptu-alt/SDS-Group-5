import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { ToastProvider } from './components/ui/Toast';
import DevRoleSwitcher from './features/menu/components/DevRoleSwitcher';
import { CartProvider, CartDrawer, CartButton} from './features/cart';

/**
 * Root App component
 * Sets up BrowserRouter, CartProvider, global Toast alerts, DevRoleSwitcher and router outlet.
 */
export const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <AppRouter />
          <CartDrawer />
          <CartButton />
          <DevRoleSwitcher />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;