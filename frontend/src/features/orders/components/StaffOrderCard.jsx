import React, { useState } from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import Button from '@/components/ui/Button';
import formatCurrency from '@/utils/formatCurrency';
import { Flame, BellRing, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';

const NEXT_STATUS_ACTION = {
  pending: {
    nextStatus: 'preparing',
    label: 'Start Preparing',
    variant: 'brand',
    icon: Flame,
  },
  preparing: {
    nextStatus: 'ready',
    label: 'Mark Ready for Pickup',
    variant: 'primary',
    icon: BellRing,
  },
  ready: {
    nextStatus: 'completed',
    label: 'Complete Handover',
    variant: 'primary',
    icon: CheckCircle2,
  },
};

export const StaffOrderCard = ({ order, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(order._id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const primaryAction = NEXT_STATUS_ACTION[order.status];
  const ActionIcon = primaryAction?.icon;

  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-black/40 transition-all">
      {/* Top Header: Order Number, Time & Status */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-sm sm:text-base text-black">
                {order.orderNumber}
              </span>
              <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formattedTime}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              {order.customer?.name || 'Walk-in Student'}
            </p>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        {/* Itemized Dishes List */}
        <ul className="flex flex-col gap-2 py-1">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex items-start justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-black text-xs">
                  {item.quantity}x
                </span>
                <span className="font-heading font-semibold text-black leading-snug">
                  {item.name}
                </span>
              </div>
              <span className="font-mono text-stone-600 tabular-nums shrink-0">
                {formatCurrency(item.subtotal || item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {/* Special Instructions Callout */}
        {order.specialInstructions && (
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong className="font-heading uppercase tracking-wider text-[10px] block text-amber-800">
                Kitchen Note:
              </strong>
              {order.specialInstructions}
            </span>
          </div>
        )}
      </div>

      {/* Footer: Total & Staff Action Controls */}
      <div className="pt-3 border-t border-stone-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
              Total
            </span>
            <span
              className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <span className="text-base sm:text-lg font-mono font-bold text-black tabular-price">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>

        {/* Status Transition Buttons */}
        <div className="flex items-center gap-2">
          {primaryAction && (
            <Button
              variant={primaryAction.variant}
              size="sm"
              isLoading={isUpdating}
              onClick={() => handleStatusChange(primaryAction.nextStatus)}
              leftIcon={ActionIcon ? <ActionIcon className="w-3.5 h-3.5" /> : null}
              className="flex-1"
            >
              {primaryAction.label}
            </Button>
          )}

          {['pending', 'preparing'].includes(order.status) && (
            <Button
              variant="subtleDanger"
              size="sm"
              disabled={isUpdating}
              onClick={() => handleStatusChange('cancelled')}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
              title="Cancel Order"
            >
              Cancel
            </Button>
          )}

          {/* Direct Status Selector for Staff Override */}
          <select
            value={order.status}
            disabled={isUpdating}
            onChange={(e) => handleStatusChange(e.target.value)}
            aria-label={`Change status for ${order.orderNumber}`}
            className="h-8.5 px-2 bg-stone-100 border border-stone-200 rounded-xl text-[11px] font-heading font-bold uppercase text-stone-700 hover:border-black focus:outline-none cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </article>
  );
};

export default StaffOrderCard;