import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
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

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const totalAmount = subtotal + tax;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
        isCartOpen,
        setIsCartOpen,
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