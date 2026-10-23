import React from 'react';

/**
 * Standard Indian FSSAI food classification symbol.
 * Green square + circle for Vegetarian, Red square + circle for Non-Vegetarian.
 */
export const VegIndicator = ({
  isVeg = true,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const sizes = {
    sm: {
      box: 'w-3.5 h-3.5 border-[1.5px] p-[1.5px]',
      dot: 'w-1.5 h-1.5',
      text: 'text-xs',
    },
    md: {
      box: 'w-4.5 h-4.5 border-2 p-[2px]',
      dot: 'w-2 h-2',
      text: 'text-xs font-medium',
    },
    lg: {
      box: 'w-5.5 h-5.5 border-2 p-[3px]',
      dot: 'w-2.5 h-2.5',
      text: 'text-sm font-medium',
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const colorStyles = isVeg
    ? {
        border: 'border-emerald-600',
        bg: 'bg-emerald-600',
        label: 'text-emerald-700',
        title: 'Vegetarian',
      }
    : {
        border: 'border-red-600',
        bg: 'bg-red-600',
        label: 'text-red-700',
        title: 'Non-Vegetarian',
      };

  return (
    <div
      className={`inline-flex items-center gap-1.5 shrink-0 select-none ${className}`}
      title={colorStyles.title}
      aria-label={colorStyles.title}
    >
      <div
        className={`flex items-center justify-center rounded-[3px] bg-white ${colorStyles.border} ${currentSize.box}`}
        role="img"
      >
        <div className={`rounded-full ${colorStyles.bg} ${currentSize.dot}`} />
      </div>

      {showLabel && (
        <span className={`${currentSize.text} ${colorStyles.label}`}>
          {isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
};

export default VegIndicator;
