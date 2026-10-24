import React from 'react';
import VegIndicator from './VegIndicator';
import AvailabilitySwitch from './AvailabilitySwitch';
import formatCurrency from '@/utils/formatCurrency';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, UtensilsCrossed, CheckSquare, Square } from 'lucide-react';

/**
 * 2026 Architectural Admin Table.
 * Aligned with references/app-screens.md:
 * - Pure rules and numeric right-alignment, zero zebra striping
 * - Clash Grotesk headings, tabular monospace numbers
 */
export const MenuTable = ({
  items = [],
  sortColumn = 'name',
  sortDirection = 'asc',
  onSort,
  onEdit,
  onDelete,
  onToggleAvailability,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
}) => {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < items.length;

  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-black" />
    ) : (
      <ArrowDown className="w-3 h-3 text-black" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm">
      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full text-left text-sm text-black border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-400 font-mono font-semibold select-none bg-stone-50/50">
              {/* Checkbox Column */}
              <th scope="col" className="w-12 px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="p-1 rounded text-stone-400 hover:text-black focus:outline-none"
                  aria-label={isAllSelected ? 'Deselect all rows' : 'Select all rows'}
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-black" />
                  ) : (
                    <Square className={`w-4 h-4 ${isSomeSelected ? 'text-black' : 'text-stone-300'}`} />
                  )}
                </button>
              </th>

              {/* Thumbnail */}
              <th scope="col" className="w-16 px-3 py-3">
                Dish
              </th>

              {/* Name (sortable) */}
              <th scope="col" className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort('name')}
                  className="group flex items-center gap-1.5 font-bold hover:text-black transition-colors focus:outline-none font-heading"
                >
                  <span>Dish Name</span>
                  {renderSortIcon('name')}
                </button>
              </th>

              {/* Dietary Indicator */}
              <th scope="col" className="w-20 px-3 py-3 text-center">
                Type
              </th>

              {/* Category (sortable) */}
              <th scope="col" className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort('category')}
                  className="group flex items-center gap-1.5 font-bold hover:text-black transition-colors focus:outline-none font-heading"
                >
                  <span>Category</span>
                  {renderSortIcon('category')}
                </button>
              </th>

              {/* Price (sortable) */}
              <th scope="col" className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onSort('price')}
                  className="group flex items-center gap-1.5 font-bold hover:text-black transition-colors ml-auto focus:outline-none font-heading"
                >
                  <span>Price</span>
                  {renderSortIcon('price')}
                </button>
              </th>

              {/* Availability Switch */}
              <th scope="col" className="px-4 py-3 text-center">
                In Stock
              </th>

              {/* Actions */}
              <th scope="col" className="px-4 py-3 text-right w-24">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item._id);

              return (
                <tr
                  key={item._id}
                  className={`
                    transition-colors hover:bg-stone-50/70
                    ${isSelected ? 'bg-stone-100/60' : ''}
                    ${!item.isAvailable ? 'opacity-65' : ''}
                  `}
                >
                  {/* Row Checkbox */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectRow(item._id)}
                      className="p-1 rounded text-stone-400 hover:text-black focus:outline-none"
                      aria-label={`Select ${item.name}`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-black" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                      )}
                    </button>
                  </td>

                  {/* Thumbnail */}
                  <td className="px-3 py-2.5">
                    <div className="w-11 h-11 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <UtensilsCrossed className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                  </td>

                  {/* Name and short description */}
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-black text-sm leading-snug">
                        {item.name}
                      </span>
                      <span className="text-xs text-stone-400 line-clamp-1 mt-0.5 font-sans">
                        {item.description}
                      </span>
                    </div>
                  </td>

                  {/* Veg / Non-Veg Indicator */}
                  <td className="px-3 py-3 text-center">
                    <VegIndicator isVeg={item.isVeg} size="sm" showLabel />
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-heading font-medium">
                      {item.category}
                    </span>
                  </td>

                  {/* Price (right-aligned tabular numbers) */}
                  <td className="px-4 py-3 text-right font-mono font-bold text-sm tabular-price text-black">
                    {formatCurrency(item.price)}
                  </td>

                  {/* Inline Availability Switch */}
                  <td className="px-4 py-3 text-center">
                    <AvailabilitySwitch
                      item={item}
                      onToggle={onToggleAvailability}
                      showLabel
                    />
                  </td>

                  {/* Actions (Edit / Delete) */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;
