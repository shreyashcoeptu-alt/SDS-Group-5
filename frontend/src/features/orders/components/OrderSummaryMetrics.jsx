import React from 'react';
import formatCurrency from '@/utils/formatCurrency';

export const OrderSummaryMetrics = ({ summary = {} }) => {
  const {
    totalOrders = 0,
    activeOrders = 0,
    completedOrders = 0,
    totalRevenue = 0,
    statusBreakdown = {},
  } = summary;

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      sub: 'Excluding cancelled orders',
      valueColor: 'text-black',
    },
    {
      label: 'Active Kitchen Queue',
      value: activeOrders,
      sub: `${statusBreakdown.pending || 0} Pending · ${statusBreakdown.preparing || 0} Prep · ${statusBreakdown.ready || 0} Ready`,
      valueColor: activeOrders > 0 ? 'text-brand-600' : 'text-black',
    },
    {
      label: 'Completed Orders',
      value: completedOrders,
      sub: 'Fulfilled & picked up',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Total Orders Placed',
      value: totalOrders,
      sub: `${statusBreakdown.cancelled || 0} Cancelled`,
      valueColor: 'text-black',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-stone-200/90 bg-white overflow-hidden shadow-sm divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-4 sm:p-5 flex flex-col justify-between gap-1 hover:bg-stone-50/50 transition-colors"
        >
          <span className="text-[11px] font-heading font-semibold text-stone-500 uppercase tracking-wider">
            {card.label}
          </span>
          <span className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums tracking-tight ${card.valueColor}`}>
            {card.value}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-0.5">
            {card.sub}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryMetrics;