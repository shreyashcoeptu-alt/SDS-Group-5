import React from 'react';

/**
 * 2026 Architectural KPI Metrics Container
 * Per references/app-screens.md: Single container split by 1px hairlines,
 * pure typographic numbers, no icons in tinted colored circles.
 */
export const MenuSummaryChips = ({ summary = {} }) => {
  const {
    total = 0,
    available = 0,
    soldOut = 0,
    categoriesCount = 0,
  } = summary;

  const chips = [
    {
      label: 'Total Dishes',
      value: total,
      valueColor: 'text-black',
    },
    {
      label: 'In Stock',
      value: available,
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Sold Out',
      value: soldOut,
      valueColor: soldOut > 0 ? 'text-brand-600' : 'text-stone-400',
    },
    {
      label: 'Categories',
      value: categoriesCount,
      valueColor: 'text-black',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-stone-200/90 bg-white overflow-hidden shadow-sm divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
      {chips.map((chip) => (
        <div
          key={chip.label}
          className="p-4 sm:p-5 flex flex-col justify-between gap-1 hover:bg-stone-50/50 transition-colors"
        >
          <span className="text-[11px] font-heading font-semibold text-stone-500 uppercase tracking-wider">
            {chip.label}
          </span>
          <span className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums tracking-tight ${chip.valueColor}`}>
            {chip.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MenuSummaryChips;
