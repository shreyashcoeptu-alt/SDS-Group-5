import React from 'react';

/**
 * 2026 Minimalist Pill & Tag Badge
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  dotColor = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-heading font-semibold rounded-md select-none transition-colors';

  const variants = {
    default: 'bg-stone-100 text-stone-700 border border-stone-200',
    black: 'bg-black text-white font-bold',
    brand: 'bg-stone-900 text-white font-bold',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold',
    danger: 'bg-red-50 text-red-800 border border-red-200 font-bold',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
    muted: 'bg-stone-100 text-stone-500 border border-stone-200',
    soldOut: 'bg-black text-white font-title font-bold uppercase tracking-widest',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 gap-1 leading-tight',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 leading-normal',
    md: 'text-xs px-3 py-1 gap-1.5 leading-normal',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColor || (
              variant === 'success' ? 'bg-emerald-600' :
              variant === 'danger' ? 'bg-red-600' :
              variant === 'brand' ? 'bg-brand-600' :
              'bg-stone-400'
            )
          }`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
