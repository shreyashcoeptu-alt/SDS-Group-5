import React from 'react';
import Badge from '@/components/ui/Badge';

const STATUS_CONFIG = {
  pending: {
    label: 'Order Placed',
    variant: 'warning',
    dotColor: 'bg-amber-500',
  },
  preparing: {
    label: 'Preparing',
    variant: 'brand',
    dotColor: 'bg-brand-500 animate-pulse',
  },
  ready: {
    label: 'Ready for Pickup',
    variant: 'success',
    dotColor: 'bg-emerald-600 animate-ping',
  },
  completed: {
    label: 'Completed',
    variant: 'default',
    dotColor: 'bg-stone-500',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'danger',
    dotColor: 'bg-red-600',
  },
};

export const OrderStatusBadge = ({ status = 'pending', size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <Badge variant={cfg.variant} size={size} dot dotColor={cfg.dotColor}>
      {cfg.label}
    </Badge>
  );
};

export default OrderStatusBadge;