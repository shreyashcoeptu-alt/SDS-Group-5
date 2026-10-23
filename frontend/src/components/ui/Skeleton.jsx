import React from 'react';

/**
 * Loading Skeleton placeholder with smooth warm pulse.
 */
export const Skeleton = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  ...props
}) => {
  const variants = {
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
    rectangular: 'rounded-xl',
    text: 'rounded h-4 w-full my-1',
  };

  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      className={`animate-pulse bg-[#EFECE6] ${variants[variant] || variants.rectangular} ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Skeleton;
