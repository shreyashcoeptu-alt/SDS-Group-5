import React, { useState } from 'react';
import dummyMenu from '../data/dummyMenu';
import { useMenu } from '../hooks/useMenu';
import MenuListItem from '../components/MenuListItem';
import MenuGridCard from '../components/MenuGridCard';
import { useToast } from '@/components/ui/Toast';
import { useCart, CartDrawer } from '@/features/cart';

export const MenuPage = () => {
  const [search, setSearch] = useState('');
  const toast = useToast();
  const { addItem, totalItemsCount, isCartOpen, setIsCartOpen } = useCart();
  const { items: liveItems, isLoading } = useMenu();

  const handleAddToCart = (item) => {
    addItem(item);
    toast.success(`${item.name} added to cart!`, 'Cart Updated');
  };

  const allItems = liveItems && liveItems.length > 0 ? liveItems : dummyMenu;

  const filteredItems = allItems.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] px-5 sm:px-10 py-8 sm:py-12 relative">
      <style>{`
        :root, [data-theme="locker"] {
          --bg: #F4F0E8;
          --surface: #FFFFFF;
          --ink: #1B2430;
          --ink-soft: #64748B;
          --primary: #F97316;
          --band-1: #FED7AA;
          --band-2: #BAE6FD;
          --band-3: #DDD6FE;
          --band-4: #BBF7D0;
          --band-5: #FEF08A;
        }
        [data-theme="blackboard"] {
          --bg: #18181B;
          --surface: #27272A;
          --ink: #FAFAFA;
          --ink-soft: #A1A1AA;
          --primary: #FACC15;
          --band-1: #3F3F46;
          --band-2: #334155;
          --band-3: #374151;
          --band-4: #2D3748;
          --band-5: #44403C;
        }
        [data-theme="pistachio"] {
          --bg: #F2F7F4;
          --surface: #FFFFFF;
          --ink: #1E2D24;
          --ink-soft: #5C7164;
          --primary: #2D6A4F;
          --band-1: #D8F3DC;
          --band-2: #B7E4C7;
          --band-3: #E9D8A6;
          --band-4: #DDF0ED;
          --band-5: #E2E8F0;
        }
        [data-theme="strawberry-milk"], [data-theme="strawberry milk"] {
          --bg: #FFF5F7;
          --surface: #FFFFFF;
          --ink: #3D1C24;
          --ink-soft: #8C626C;
          --primary: #E11D48;
          --band-1: #FFE4E6;
          --band-2: #FECDD3;
          --band-3: #FED7AA;
          --band-4: #E0E7FF;
          --band-5: #F5D0FE;
        }
      `}</style>

      <main className="max-w-[1240px] mx-auto flex flex-col gap-8 pb-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            The Lunchroom
          </h1>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                aria-label="Search menu"
                className="w-full h-11 px-4 rounded-[12px] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] border-2 border-[var(--ink)] focus:outline-none text-sm"
              />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-4 h-11 bg-[var(--primary)] text-white font-semibold rounded-[12px] border-2 border-[var(--ink)] shadow-md flex items-center justify-center gap-2"
            >
              <span>🛒 Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-[var(--ink)] rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="md:hidden bg-[var(--surface)] rounded-[24px] p-5 divide-y divide-[var(--ink)]/15">
          {filteredItems.map((item, index) => (
            <MenuListItem
              key={item._id || item.id}
              item={item}
              index={index}
              onAdd={handleAddToCart}
            />
          ))}
          {filteredItems.length === 0 && (
            <p className="py-8 text-center text-sm text-[var(--ink-soft)]">
              No items found.
            </p>
          )}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <MenuGridCard
              key={item._id || item.id}
              item={item}
              index={index}
              onAdd={handleAddToCart}
            />
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-[var(--ink-soft)]">
              No items found.
            </p>
          )}
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default MenuPage;