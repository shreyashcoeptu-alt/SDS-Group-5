import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, CartDrawer } from './features/cart';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/Navbar';
import AppRouter from './routes/AppRouter';
import DevRoleSwitcher from './features/menu/components/DevRoleSwitcher';

/**
 * Root App component for The Lunchroom
 * Wraps AuthProvider, CartProvider, ToastProvider, Navbar, Dev tools, and unified Router.
 */
export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-stone-900 font-sans">
              <Navbar />
              
              <main className="flex-1">
                <AppRouter />
              </main>

              <CartDrawer />
              <DevRoleSwitcher />

              {/* Centralized Footer */}
              <footer className="border-t border-stone-200 py-6 text-center text-sm bg-[#090d16] text-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <strong>The Lunchroom</strong> — College Cafeteria Ordering
                  </div>
                  <div>
                    Node.js • Express • MongoDB • JWT • React
                  </div>
                </div>
              </footer>
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;