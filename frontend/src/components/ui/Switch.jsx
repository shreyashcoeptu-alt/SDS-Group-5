import React from 'react';

/**
 * Accessible Toggle Switch primitive with micro-animation.
 */
export const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  id,
  size = 'md',
  className = '',
  activeColor = 'bg-brand-600',
  inactiveColor = 'bg-stone-300',
}) => {
  const switchId = id || (label ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const sizes = {
    sm: {
      track: 'w-8 h-4.5 p-0.5',
      thumb: 'w-3.5 h-3.5',
      translate: 'translate-x-3.5',
    },
    md: {
      track: 'w-11 h-6 p-0.5',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7.5 p-1',
      thumb: 'w-6 h-6',
      translate: 'translate-x-6.5',
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex shrink-0 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500
          ${checked ? activeColor : inactiveColor}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${currentSize.track}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow-md transform
            ring-0 transition duration-200 ease-in-out
            ${checked ? currentSize.translate : 'translate-x-0'}
            ${currentSize.thumb}
          `}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col cursor-pointer" onClick={handleToggle}>
          {label && (
            <label htmlFor={switchId} className="text-xs sm:text-sm font-medium text-cafe-text cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-cafe-subtext">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Switch;
