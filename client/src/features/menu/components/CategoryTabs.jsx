import React, { useRef, useEffect } from 'react';

/**
 * 2026 Minimalist Category Navigation Tabs.
 * No gradient color blocks. Clean, high-contrast, architectural layout
 * with smooth horizontal scrolling on mobile.
 */
export const CategoryTabs = ({
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  categoryCounts = {},
  className = '',
}) => {
  const tabsContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  // Scroll active tab into view smoothly
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  const allCategories = ['All', ...categories.filter((c) => c !== 'All')];

  // Keyboard navigation support for accessibility
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % allCategories.length;
      onSelectCategory(allCategories[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + allCategories.length) % allCategories.length;
      onSelectCategory(allCategories[prevIndex]);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-30 bg-[#F8F9FA]/95 backdrop-blur-md border-b border-stone-200 transition-all ${className}`}
      aria-label="Menu categories"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={tabsContainerRef}
          role="tablist"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-3"
        >
          {allCategories.map((cat, idx) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            const count = categoryCounts[cat];

            return (
              <button
                key={cat}
                ref={isActive ? activeTabRef : null}
                role="tab"
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`
                  relative shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-heading
                  transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black
                  ${isActive
                    ? 'bg-[#0F0F11] text-white font-bold ring-1 ring-black shadow-sm'
                    : 'bg-white text-stone-600 hover:text-black hover:border-stone-400 border border-stone-200 font-semibold'
                  }
                `}
              >
                <span className="tracking-tight">{cat}</span>
                {count !== undefined && (
                  <span
                    className={`
                      text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-md font-bold
                      ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}
                    `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryTabs;
