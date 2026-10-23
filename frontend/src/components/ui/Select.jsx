import React from 'react';

/**
 * Accessible Select primitive with styled dropdown icon and validation feedback.
 */
export const Select = React.forwardRef(({
  id,
  label,
  error,
  helperText,
  options = [],
  className = '',
  containerClassName = '',
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs sm:text-sm font-semibold text-cafe-text select-none">
          {label}
          {required && <span className="text-brand-600 ml-1" title="Required">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          className={`
            w-full appearance-none bg-white text-cafe-text text-sm rounded-xl border
            transition-all duration-150 h-10 pl-3.5 pr-10
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
              : 'border-cafe-border hover:border-cafe-borderDark focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
            }
            focus:outline-none shadow-sm disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {children || options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 flex items-center pointer-events-none text-cafe-subtext">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-cafe-subtext mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
