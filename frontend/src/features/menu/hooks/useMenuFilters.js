import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Filter, search, and sort hook for menu items.
 * Syncs filters with URL search params so customer views are shareable.
 */
export const useMenuFilters = (items = [], options = {}) => {
  const { syncWithUrl = true, isCustomerView = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params or defaults
  const initialCategory = syncWithUrl ? searchParams.get('category') || 'All' : 'All';
  const initialSearch = syncWithUrl ? searchParams.get('q') || '' : '';
  const initialDiet = syncWithUrl ? searchParams.get('diet') || 'all' : 'all'; // 'all' | 'veg' | 'nonveg'
  const initialSort = syncWithUrl ? searchParams.get('sort') || 'popular' : 'popular';
  const initialShowSoldOut = syncWithUrl ? searchParams.get('soldOut') === 'true' : false;
  const initialAvailability = syncWithUrl ? searchParams.get('status') || 'all' : 'all'; // for admin: 'all' | 'available' | 'sold_out'

  const [category, setCategoryState] = useState(initialCategory);
  const [search, setSearchState] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [diet, setDietState] = useState(initialDiet);
  const [sortBy, setSortByState] = useState(initialSort);
  const [showSoldOut, setShowSoldOutState] = useState(initialShowSoldOut);
  const [availability, setAvailabilityState] = useState(initialAvailability);

  // Debounce search input by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync state to URL params if enabled
  useEffect(() => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
    if (diet && diet !== 'all') params.set('diet', diet);
    if (sortBy && sortBy !== 'popular') params.set('sort', sortBy);
    if (isCustomerView && showSoldOut) params.set('soldOut', 'true');
    if (!isCustomerView && availability !== 'all') params.set('status', availability);

    setSearchParams(params, { replace: true });
  }, [category, debouncedSearch, diet, sortBy, showSoldOut, availability, syncWithUrl, isCustomerView, setSearchParams]);

  // Filtered and sorted dataset
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];

    return items
      .filter((item) => {
        // Category filter
        if (category && category !== 'All') {
          if ((item.category || '').toLowerCase() !== category.toLowerCase()) {
            return false;
          }
        }

        // Search query (matches name or description)
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase().trim();
          const nameMatch = (item.name || '').toLowerCase().includes(q);
          const descMatch = (item.description || '').toLowerCase().includes(q);
          if (!nameMatch && !descMatch) return false;
        }

        // Diet filter (veg / nonveg)
        if (diet === 'veg' && !item.isVeg) return false;
        if (diet === 'nonveg' && item.isVeg) return false;

        // Customer view: hide sold out items unless showSoldOut toggle is ON
        if (isCustomerView) {
          if (!showSoldOut && !item.isAvailable) return false;
        } else {
          // Admin view availability filter
          if (availability === 'available' && !item.isAvailable) return false;
          if (availability === 'sold_out' && item.isAvailable) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        if (sortBy === 'name_asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        // 'popular' / default order (available items first, then newer items)
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1;
        }
        return 0;
      });
  }, [items, category, debouncedSearch, diet, showSoldOut, availability, sortBy, isCustomerView]);

  const resetFilters = () => {
    setCategoryState('All');
    setSearchState('');
    setDebouncedSearch('');
    setDietState('all');
    setSortByState('popular');
    setShowSoldOutState(false);
    setAvailabilityState('all');
  };

  const hasActiveFilters = 
    category !== 'All' || 
    search.trim() !== '' || 
    diet !== 'all' || 
    sortBy !== 'popular' || 
    (isCustomerView ? showSoldOut : availability !== 'all');

  return {
    filteredItems,
    category,
    setCategory: setCategoryState,
    search,
    setSearch: setSearchState,
    debouncedSearch,
    diet,
    setDiet: setDietState,
    sortBy,
    setSortBy: setSortByState,
    showSoldOut,
    setShowSoldOut: setShowSoldOutState,
    availability,
    setAvailability: setAvailabilityState,
    resetFilters,
    hasActiveFilters,
    totalCount: items.length,
    matchCount: filteredItems.length,
  };
};

export default useMenuFilters;
