import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import VegIndicator from './VegIndicator';
import Switch from '@/components/ui/Switch';
import { SORT_OPTIONS } from '@/utils/constants';

/**
 * 2026 Minimalist Menu Filters Toolbar
 * Flat surfaces, high-contrast inputs, zero gradient clutter.
 */
export const MenuFilters = ({
  search,
  onSearchChange,
  diet,
  onDietChange,
  sortBy,
  onSortChange,
  showSoldOut,
  onToggleSoldOut,
  hasActiveFilters,
  onResetFilters,
  matchCount,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-4.5 shadow-sm flex flex-col gap-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dishes, snacks, chai..."
            className="w-full h-10.5 pl-10 pr-9 bg-[#F8F9FA] text-black placeholder:text-stone-400 text-sm font-sans rounded-xl border border-stone-200 hover:border-stone-300 focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition-all focus:outline-none"
            aria-label="Search dishes"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-black rounded-full"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dietary Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F8F9FA] rounded-xl border border-stone-200/80 shrink-0">
          <button
            type="button"
            onClick={() => onDietChange('all')}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all select-none
              ${diet === 'all'
                ? 'bg-black text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-black'
              }
            `}
          >
            All Dishes
          </button>

          <button
            type="button"
            onClick={() => onDietChange('veg')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all select-none
              ${diet === 'veg'
                ? 'bg-emerald-700 text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-emerald-800'
              }
            `}
          >
            <VegIndicator isVeg={true} size="sm" />
            <span>Veg</span>
          </button>

          <button
            type="button"
            onClick={() => onDietChange('nonveg')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all select-none
              ${diet === 'nonveg'
                ? 'bg-red-700 text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-red-800'
              }
            `}
          >
            <VegIndicator isVeg={false} size="sm" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar: Sort Dropdown, Sold-out toggle, and match counts */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium flex items-center gap-1 font-heading">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white border border-stone-200 text-black text-xs font-heading font-semibold rounded-lg px-2.5 py-1.5 hover:border-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-sm"
              aria-label="Sort dishes"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sold out toggle switch */}
          <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
            <Switch
              size="sm"
              checked={showSoldOut}
              onChange={onToggleSoldOut}
              id="sold-out-toggle"
              label="Show sold-out items"
              activeColor="bg-black"
            />
          </div>
        </div>

        {/* Count text & reset button */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-stone-500 font-mono text-[11px] tabular-nums">
            <strong className="text-black font-bold">{matchCount}</strong> / {totalCount} items
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-brand-600 hover:text-black font-heading font-bold underline underline-offset-2 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuFilters;
