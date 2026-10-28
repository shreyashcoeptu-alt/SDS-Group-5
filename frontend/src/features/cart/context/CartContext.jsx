import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const isAdmin = ['admin', 'cafeteria_admin', 'staff'].includes(user?.role);

    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('lunchroom:cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('lunchroom:cart', JSON.stringify(items));
    }, [items]);

    const addItem = (dish) => {
        if (isAdmin) return;
        setItems((prevItems) => {
            const existing = prevItems.find((i) => (i._id || i.id) === (dish._id || dish.id));
            if (existing) {
                return prevItems.map((i) =>
                    (i._id || i.id) === (dish._id || dish.id)
                        ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
                        : i
                );
            }
            return [...prevItems, { ...dish, quantity: 1, subtotal: dish.price }];
        });
    };

    const removeItem = (id) => {
        setItems((prevItems) => prevItems.filter((i) => (i._id || i.id) !== id));
    };

    const updateQuantity = (id, delta) => {
        setItems((prevItems) =>
            prevItems
                .map((i) => {
                    if ((i._id || i.id) === id) {
                        const newQty = i.quantity + delta;
                        return newQty > 0
                            ? { ...i, quantity: newQty, subtotal: newQty * i.price }
                            : null;
                    }
                    return i;
                })
                .filter(Boolean)
        );
    };

    const clearCart = () => setItems([]);

    const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const gst = subtotal * 0.05;
    const grandTotal = subtotal + gst;

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItemsCount,
                subtotal,
                gst,
                grandTotal,
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