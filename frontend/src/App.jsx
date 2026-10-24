
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { ToastProvider } from './components/ui/Toast';
import DevRoleSwitcher from './features/menu/components/DevRoleSwitcher';

/**
 * Root App component
 * Sets up BrowserRouter, global Toast alerts, DevRoleSwitcher and router outlet.
 */
export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRouter />
        <DevRoleSwitcher />
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
