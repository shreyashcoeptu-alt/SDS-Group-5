import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, CartDrawer } from './features/cart';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/Navbar';
import AppRouter from './routes/AppRouter';

/**
 * Root App component for The Lunchroom
 * Wraps AuthProvider, CartProvider, ToastProvider, Navbar and unified Router.
 */
export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-stone-900 font-sans">
              <Navbar />
              <div className="flex-1">
                <AppRouter />
              </div>
              <CartDrawer />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
