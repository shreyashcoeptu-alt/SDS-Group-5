import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = ['admin', 'cafeteria_admin', 'staff'].includes(user?.role);

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cafeteria_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cafeteria_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (dish) => {
    // Safety net: Admins cannot add items to cart
    if (isAdmin) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem === (dish._id || dish.id));
      if (existing) {
        return prev.map((i) =>
          i.menuItem === (dish._id || dish.id)
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItem: dish._id || dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          subtotal: dish.price,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (menuItemId, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.menuItem === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, subtotal: newQty * item.price }
              : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menuItem !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cafeteria_cart');
  };

  // Standard 2-Decimal Precision Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const subtotal = Number(rawSubtotal.toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2)); // 5% GST with 2 decimals
  const totalAmount = Number((subtotal + tax).toFixed(2));
  const totalItemsCount = isAdmin ? 0 : items.reduce((sum, item) => sum + item.quantity, 0);

  const safeSetIsCartOpen = (open) => {
    if (isAdmin) {
      setIsCartOpen(false);
      return;
    }
    setIsCartOpen(open);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        tax,
        totalAmount,
        totalItemsCount,
        isCartOpen: isAdmin ? false : isCartOpen,
        setIsCartOpen: safeSetIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};