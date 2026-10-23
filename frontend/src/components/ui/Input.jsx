import React from 'react';

/**
 * 2026 Minimalist Input Primitive with high-contrast borders and Clash Grotesk labels.
 */
export const Input = React.forwardRef(({
  id,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  className = '',
  containerClassName = '',
  disabled = false,
  required = false,
  maxLength,
  value,
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-xs font-heading font-semibold text-black uppercase tracking-wider select-none">
            {label}
            {required && <span className="text-brand-600 ml-1" title="Required">*</span>}
          </label>
          {maxLength && value !== undefined && (
            <span className="text-[11px] text-stone-400 font-mono tabular-nums">
              {String(value || '').length}/{maxLength}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-stone-400">
            {leftIcon}
          </div>
        )}
        {prefix && (
          <span className="absolute left-3.5 font-bold font-mono text-stone-400 select-none text-sm">
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          className={`
            w-full bg-white text-black placeholder:text-stone-400
            text-sm font-sans rounded-xl border transition-all duration-150
            h-10 px-3.5
            ${leftIcon ? 'pl-10' : ''}
            ${prefix ? 'pl-8' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${suffix ? 'pr-8' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100' 
              : 'border-stone-200 hover:border-black focus:border-black focus:ring-1 focus:ring-black'
            }
            focus:outline-none shadow-sm disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {suffix && (
          <span className="absolute right-3.5 font-medium text-stone-400 select-none text-sm">
            {suffix}
          </span>
        )}
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-stone-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-stone-400 mt-0.5 font-sans">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
