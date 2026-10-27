import React, { useState, useMemo } from 'react';
import useMenu from '../hooks/useMenu';
import useMenuFilters from '../hooks/useMenuFilters';
import FoodCard from '../components/FoodCard';
import FoodCardSkeleton from '../components/FoodCardSkeleton';
import CategoryTabs from '../components/CategoryTabs';
import MenuFilters from '../components/MenuFilters';
import FoodDetailModal from '../components/FoodDetailModal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Utensils, RefreshCw, AlertCircle } from 'lucide-react';
import { useCart } from '@/features/cart';

/**
- Customer Menu Page (/menu)
- 2026 Gen-Z Modern Editorial Aesthetic.
- Features Lovelo Black architectural title, Clash Grotesk / Satoshi body,
- and zero-gradient clean tabs.
 */
export const MenuPage = () => {
  const { items, isLoading, error, refetch, summary } = useMenu();
  const toast = useToast();
  const { addItem, totalItemsCount, setIsCartOpen } = useCart();

  const {
    filteredItems,
    category,
    setCategory,
    search,
    setSearch,
    diet,
    setDiet,
    sortBy,
    setSortBy,
    showSoldOut,
    setShowSoldOut,
    resetFilters,
    hasActiveFilters,
    totalCount,
    matchCount,
  } = useMenuFilters(items, { syncWithUrl: true, isCustomerView: true });

  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  // Time-of-day greeting & meal slot determination
  const { mealSlot, formattedDate, greetingWord } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    let slot = 'Cafeteria Service';
    let greet = 'CAMPUS BITES';

    if (hour >= 5 && hour < 11) {
      slot = 'Breakfast Menu';
      greet = 'MORNING SERVICE';
    } else if (hour >= 11 && hour < 15.5) {
      slot = 'Lunch & Thali Service';
      greet = 'LUNCH DISHES';
    } else if (hour >= 15.5 && hour < 19) {
      slot = 'Snacks & Evening Chai';
      greet = 'EVENING SNACKS';
    } else {
      slot = 'Dinner & Light Bites';
      greet = 'NIGHT KITCHEN';
    }

    const dateStr = now.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    return {
      mealSlot: slot,
      formattedDate: dateStr,
      greetingWord: greet,
    };
  }, []);

  // Compute item counts per category for tab badges
  const categoryCounts = useMemo(() => {
    const counts = { All: items.length };
    items.forEach((it) => {
      const cat = (it.category || '').trim();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  /**
   * Handle food card Add button click
   * Adds selected item to CartContext and triggers confirmation alert
   */
  const handleAddToCart = (item) => {
    addItem(item);
    toast.success(
      `${item.name} added to cart`,
      'Cart Updated'
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-[#0F0F11]">
      {/* 2026 Architectural Editorial Header */}
      <header className="bg-white border-b border-stone-200/90 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="flex flex-col gap-2 max-w-2xl">
            {/* Top Micro-Bar */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold uppercase tracking-wider text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Kitchen
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 uppercase tracking-wider font-semibold">
                {mealSlot}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-400">
                {formattedDate}
              </span>
            </div>

            {/* Lovelo Black Master Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-title uppercase tracking-tightest text-black leading-none mt-1">
              {greetingWord}
            </h1>

            <p className="text-sm sm:text-base text-stone-500 font-sans leading-relaxed">
              Skip the queue. Freshly prepared meals, rolls & beverages ready for instant pickup.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex items-center gap-3 py-2 px-3.5 bg-stone-100 rounded-xl border border-stone-200 text-xs font-heading font-medium self-start md:self-auto">
            <span className="text-black font-bold font-mono text-sm tabular-nums">{summary.available}</span>
            <span className="text-stone-500">Dishes Available Now</span>
          </div>
        </div>
      </header>

      {/* Sticky Minimalist Category Tabs */}
      <CategoryTabs
        categories={summary.categories}
        activeCategory={category}
        onSelectCategory={setCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Catalog Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Search & Filters */}
        <div className="mb-6">
          <MenuFilters
            search={search}
            onSearchChange={setSearch}
            diet={diet}
            onDietChange={setDiet}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showSoldOut={showSoldOut}
            onToggleSoldOut={setShowSoldOut}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            matchCount={matchCount}
            totalCount={totalCount}
          />
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-black mb-1.5">
              Unable to load cafeteria catalog
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
              {error}. Please check your connection or switch back to mock mode.
            </p>
            <Button
              variant="primary"
              onClick={refetch}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Loading
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-10 sm:p-14 text-center max-w-md mx-auto shadow-sm my-10 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-7 h-7 opacity-60" />
            </div>
            <h3 className="text-lg font-bold font-heading text-black mb-1.5">
              No dishes match your filter
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
              Try adjusting your dietary filter or search query to find other tasty dishes.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={resetFilters}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Food Items Grid */}
        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5 sm:gap-5">
            {filteredItems.map((item) => (
              <FoodCard
                key={item._id}
                item={item}
                onCardClick={setSelectedItemForModal}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      <FoodDetailModal
        item={selectedItemForModal}
        isOpen={Boolean(selectedItemForModal)}
        onClose={() => setSelectedItemForModal(null)}
        onAdd={handleAddToCart}
      />
    </div>
  );
};

export default MenuPage;