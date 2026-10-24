import React from 'react';
import VegIndicator from './VegIndicator';
import { formatCurrency } from '@/utils/formatCurrency';

export const MenuGridCard = ({ item, index = 0, onAdd }) => {
  const tintColor = `var(--band-${(index % 5) + 1})`;

  return (
    <div className="bg-[var(--surface)] rounded-[16px] overflow-hidden flex flex-col h-full select-none">
      {/* 1. Image Area: full card width, aspect-[3/2], top corners follow card radius */}
      <div
        className="w-full aspect-[3/2] rounded-t-[16px] overflow-hidden"
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

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-[18px] text-[var(--ink)] leading-snug">
          {item.name}
        </h3>

        <div className="flex items-center gap-2">
          <VegIndicator isVeg={item.isVeg} size="sm" />
          <span className="font-bold text-[18px] text-[var(--ink)]">
            {formatCurrency(item.price)}
          </span>
        </div>

        <p className="text-[14px] text-[var(--ink-soft)] line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>
        <button
          type="button"
          onClick={() => onAdd(item)}
          aria-label={`Add ${item.name}`}
          className="mt-2 w-full min-h-[48px] h-12 rounded-[12px] border-2 border-[var(--ink)] bg-[var(--surface)] text-[var(--primary)] font-bold text-base flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 active:scale-[0.98] transition-transform"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MenuGridCard;
