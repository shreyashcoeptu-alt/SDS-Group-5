import React from 'react';
import { useCart } from './CartContext';

export const CartButton = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-black text-white px-5 py-3 rounded-full shadow-2xl hover:bg-gray-800 transition-transform active:scale-95"
    >
      <span className="font-semibold text-sm">View Cart</span>
      <span className="bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {totalItemsCount}
      </span>
    </button>
  );
};