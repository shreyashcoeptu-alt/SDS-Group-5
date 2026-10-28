import React from 'react';

/**
 * 2026 Tactile Button Primitive.
 * High-contrast, crisp typography (Clash Grotesk / General Sans),
 * tactile active feedback, no blurry shadows.
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-heading transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

  const variants = {
    primary: 'bg-black text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm focus-visible:ring-black',
    brand: 'bg-brand-600 text-white hover:bg-black active:bg-stone-900 shadow-sm focus-visible:ring-brand-600',
    secondary: 'bg-stone-100 text-black hover:bg-stone-200 active:bg-stone-300 border border-stone-200 focus-visible:ring-stone-400',
    outline: 'border border-stone-300 bg-white text-black hover:border-black hover:bg-stone-50 focus-visible:ring-black shadow-sm',
    ghost: 'text-stone-500 hover:text-black hover:bg-stone-100 focus-visible:ring-black',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm focus-visible:ring-red-500',
    subtleDanger: 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 focus-visible:ring-red-400',
  };

  const sizes = {
    xs: 'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg gap-1.5 h-7',
    sm: 'text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl gap-1.5 h-8.5',
    md: 'text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-xl gap-2 h-10',
    lg: 'text-sm sm:text-base font-bold uppercase tracking-wider px-5 py-2.5 rounded-2xl gap-2.5 h-12',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-0.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
