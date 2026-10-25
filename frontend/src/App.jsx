import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { ToastProvider } from './components/ui/Toast';
import DevRoleSwitcher from './features/menu/components/DevRoleSwitcher';
import { CartProvider } from './features/cart';

/**
 * Root App component
 * Sets up BrowserRouter, global Toast alerts, CartProvider, DevRoleSwitcher and router outlet.
 */
export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <AppRouter />
          <DevRoleSwitcher />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;