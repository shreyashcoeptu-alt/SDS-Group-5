import React from 'react';
import VegIndicator from './VegIndicator';
import AvailabilitySwitch from './AvailabilitySwitch';
import formatCurrency from '@/utils/formatCurrency';
import { Edit2, Trash2, UtensilsCrossed, CheckSquare, Square } from 'lucide-react';

/**
 * 2026 Admin Card Grid View (mobile & tablet).
 * Clean, flat surfaces with high-contrast typography and instant availability toggles.
 */
export const MenuGrid = ({
  items = [],
  onEdit,
  onDelete,
  onToggleAvailability,
  selectedIds = [],
  onSelectRow,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item._id);

        return (
          <div
            key={item._id}
            className={`
              relative flex flex-col justify-between p-4 rounded-2xl border bg-white shadow-sm
              transition-all duration-150
              ${isSelected ? 'border-black ring-1 ring-black' : 'border-stone-200'}
              ${!item.isAvailable ? 'opacity-70 bg-stone-50/70' : ''}
            `}
          >
            {/* Top row: Checkbox, thumbnail, and main details */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onSelectRow(item._id)}
                className="mt-0.5 p-1 rounded text-stone-400 hover:text-black focus:outline-none shrink-0"
                aria-label={`Select ${item.name}`}
              >
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-black" />
                ) : (
                  <Square className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                )}
              </button>

              <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <UtensilsCrossed className="w-5 h-5 text-stone-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <VegIndicator isVeg={item.isVeg} size="sm" />
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-heading font-semibold">
                    {item.category}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-sm text-black truncate leading-snug">
                  {item.name}
                </h4>

                <p className="text-xs text-stone-400 line-clamp-1 mt-0.5 font-sans">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Bottom Row: Price, Availability Switch, Actions */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">Price</span>
                <span className="text-sm font-bold font-mono text-black tabular-price">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <AvailabilitySwitch
                  item={item}
                  onToggle={onToggleAvailability}
                  showLabel
                />

                <div className="flex items-center gap-1 pl-2 border-l border-stone-200">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-black hover:bg-stone-100 transition-colors focus:outline-none"
                    title={`Edit ${item.name}`}
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
                    title={`Delete ${item.name}`}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuGrid;
