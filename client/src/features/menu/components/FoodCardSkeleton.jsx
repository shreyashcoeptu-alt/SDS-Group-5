import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

/**
 * Skeleton loader representing a FoodCard in loading state.
 */
export const FoodCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-cafe-border overflow-hidden shadow-soft flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-stone-200 w-full" />

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Category & Tag */}
          <div className="flex items-center justify-between">
            <Skeleton width="40%" height="16px" className="rounded-full" />
            <Skeleton width="18px" height="18px" className="rounded-[4px]" />
          </div>

          {/* Title */}
          <Skeleton width="75%" height="22px" className="rounded-md mt-1" />

          {/* Description lines */}
          <div className="flex flex-col gap-1.5 mt-1">
            <Skeleton width="100%" height="14px" className="rounded" />
            <Skeleton width="85%" height="14px" className="rounded" />
          </div>
        </div>

        {/* Footer Skeleton: Price + Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-cafe-border/60">
          <Skeleton width="60px" height="24px" className="rounded-md" />
          <Skeleton width="72px" height="36px" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default FoodCardSkeleton;
