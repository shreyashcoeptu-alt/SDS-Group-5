import React from 'react';
import VegIndicator from './VegIndicator';
import { formatCurrency } from '@/utils/formatCurrency';

export const MenuListItem = ({ item, index = 0, onAdd }) => {
  const tintColor = `var(--band-1)`;

  return (
    <div className="py-6 flex items-start justify-between gap-4 border-b border-[var(--ink)]/15 last:border-b-0">
      <div className="flex-1 min-w-0 flex flex-col justify-start">

        <VegIndicator isVeg={item.isVeg} size="sm" />

        <h3 className="font-bold text-[20px] text-[var(--ink)] leading-snug mt-1.5 break-words">
          {item.name}
        </h3>


        <div className="font-bold text-[18px] text-[var(--ink)] mt-1">
          {formatCurrency(item.price)}
        </div>

        <p className="text-[15px] leading-[1.5] text-[var(--ink-soft)] mt-1.5">
          {item.description}
        </p>
      </div>


      <div className="w-[40%] max-w-[130px] shrink-0 flex flex-col items-center relative pb-6">
        <div
          className="w-full aspect-square rounded-[16px] overflow-hidden"
          style={{ backgroundColor: tintColor }}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => item.isAvailable !== false && onAdd(item)}
          disabled={item.isAvailable === false}
          aria-label={item.isAvailable === false ? `${item.name} is sold out` : `Add ${item.name}`}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] min-h-[48px] h-12 rounded-[12px] border-2 border-[var(--ink)] font-bold text-base flex items-center justify-center transition-transform select-none ${
            item.isAvailable === false
              ? 'bg-stone-200 text-stone-500 border-stone-400 cursor-not-allowed opacity-75'
              : 'bg-[var(--surface)] text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 active:scale-[0.98]'
          }`}
        >
          {item.isAvailable === false ? 'Sold Out' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default MenuListItem;
