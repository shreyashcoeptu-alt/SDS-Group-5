import React, { useState } from 'react';
import { Plus, UtensilsCrossed, Check } from 'lucide-react';
import VegIndicator from './VegIndicator';
import formatCurrency from '@/utils/formatCurrency';

/**
 * Modern 2026 Gen-Z Food Card
 * High contrast, crisp 1px borders, bold typography, tactile Add interaction.
 */
export const FoodCard = ({
  item,
  onCardClick,
  onAdd,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const {
    _id,
    name,
    category,
    price,
    description,
    image,
    isVeg,
    isAvailable,
  } = item;

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);

    /* 
     * INTEGRATION STUB: Cart Feature (Student 3)
     * Replace or connect to Student 3's useCart().addItem(item)
     */
    if (onAdd) {
      onAdd(item);
    }
  };

  return (
    <article
      onClick={() => onCardClick && onCardClick(item)}
      className={`
        group relative flex flex-col justify-between bg-white rounded-2xl border
        transition-all duration-200 cursor-pointer overflow-hidden
        ${isAvailable 
          ? 'border-stone-200/90 hover:border-black/40 shadow-sm hover:shadow-card hover:-translate-y-0.5' 
          : 'border-stone-200 bg-stone-50/80 opacity-70 grayscale-[0.4]'
        }
        ${className}
      `}
      aria-label={`${name}, ${isVeg ? 'Vegetarian' : 'Non-Vegetarian'}, ${formatCurrency(price)}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {image && !imageError ? (
          <img
            src={image}
            alt={name}
            onError={() => setImageError(true)}
            loading="lazy"
            className={`
              w-full h-full object-cover transition-transform duration-500 ease-out
              ${isAvailable ? 'group-hover:scale-105' : 'grayscale'}
            `}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <UtensilsCrossed className="w-8 h-8 mb-1 opacity-40" />
            <span className="text-[11px] font-heading font-medium tracking-wide uppercase">Kitchen Dish</span>
          </div>
        )}

        {/* Sold Out Stamp Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-2">
            <span className="px-3 py-1 bg-black text-white text-[11px] font-title font-extrabold uppercase tracking-widest rounded-lg border border-white/20">
              Sold Out
            </span>
          </div>
        )}

        {/* Category Pill - Clean Minimalist White */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-black text-[11px] font-heading font-semibold tracking-tight border border-black/10 shadow-sm">
            {category}
          </span>
        </div>

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-2.5 right-2.5 p-1 rounded-md bg-white/95 backdrop-blur-sm border border-black/10 shadow-sm z-10">
          <VegIndicator isVeg={isVeg} size="sm" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-4.5 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <h3
            className={`
              text-base sm:text-lg font-heading font-bold leading-snug line-clamp-1 tracking-tight transition-colors
              ${isAvailable ? 'text-black group-hover:text-brand-600' : 'text-stone-500'}
            `}
            title={name}
          >
            {name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-sans">
            {description}
          </p>
        </div>

        {/* Card Footer: Price & Add Button */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-stone-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono font-medium">Price</span>
            <span className="text-base sm:text-lg font-bold font-mono text-black tabular-price">
              {formatCurrency(price)}
            </span>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleAddClick}
            className={`
              inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold
              transition-all duration-150 select-none shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-black
              ${justAdded
                ? 'bg-emerald-600 text-white scale-105'
                : isAvailable
                  ? 'bg-black text-white hover:bg-brand-600 active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }
            `}
            aria-label={isAvailable ? `Add ${name} to order` : `${name} is sold out`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
