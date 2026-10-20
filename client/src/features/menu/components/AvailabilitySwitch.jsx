import React, { useState } from 'react';
import Switch from '@/components/ui/Switch';

/**
 * Inline availability switch for Menu Table and Admin Cards.
 * Supports optimistic UI with in-progress loading indicator.
 */
export const AvailabilitySwitch = ({
  item,
  onToggle,
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newVal) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggle(item._id, newVal);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Switch
        size={size}
        checked={Boolean(item.isAvailable)}
        onChange={handleChange}
        disabled={isUpdating}
        activeColor="bg-emerald-600"
        inactiveColor="bg-stone-300"
        aria-label={`Toggle availability for ${item.name}`}
      />

      {isUpdating && (
        <svg className="animate-spin h-3.5 w-3.5 text-brand-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}

      {showLabel && (
        <span
          className={`text-xs font-semibold select-none ${
            item.isAvailable ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          {item.isAvailable ? 'In Stock' : 'Sold Out'}
        </span>
      )}
    </div>
  );
};

export default AvailabilitySwitch;
