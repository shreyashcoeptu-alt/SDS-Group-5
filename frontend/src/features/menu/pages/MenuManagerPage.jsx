import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useMenu from '../hooks/useMenu';
import useCurrentUser from '../hooks/useCurrentUser';
import MenuSummaryChips from '../components/MenuSummaryChips';
import MenuTable from '../components/MenuTable';
import MenuGrid from '../components/MenuGrid';
import MenuItemForm from '../components/MenuItemForm';
import Drawer from '@/components/ui/Drawer';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import { ROLES } from '@/utils/constants';
import {
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ShieldAlert,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertOctagon,
  UtensilsCrossed,
} from 'lucide-react';

/**
 * 2026 Admin Menu Manager Page (/admin/menu)
 * Clean, high-contrast management workspace with Lovelo Black titles,
 * Clash Grotesk headers, and tabular data displays.
 */
export const MenuManagerPage = () => {
  const { user, isAdmin, setRole } = useCurrentUser();
  const {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    bulkToggleAvailability,
    summary,
  } = useMenu();

  // View state: 'table' (desktop default) or 'grid' (cards)
  const [viewMode, setViewMode] = useState('table');

  // Toolbar filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Table sorting
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Drawer form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk row selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Role Gate: Non-admin protection
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 max-w-md w-full text-center shadow-sm animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-black font-title uppercase tracking-tight text-black mb-1.5">
            Admin Access Required
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed font-sans">
            You are signed in as <strong className="text-black font-bold">Customer ({user.name})</strong>. Menu editing and stock availability controls are restricted to cafeteria managers.
          </p>

          <div className="flex flex-col gap-2.5">
            <Button
              variant="primary"
              onClick={() => setRole(ROLES.ADMIN)}
              className="w-full font-heading font-bold uppercase tracking-wider text-xs"
            >
              Switch to Admin Role (Dev Demo)
            </Button>

            <Link to="/menu" className="w-full">
              <Button variant="outline" className="w-full font-heading text-xs uppercase tracking-wider" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Customer Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort items for display
  const processedItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const nameMatch = (item.name || '').toLowerCase().includes(q);
          const descMatch = (item.description || '').toLowerCase().includes(q);
          if (!nameMatch && !descMatch) return false;
        }

        // Category
        if (categoryFilter !== 'All') {
          if ((item.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
            return false;
          }
        }

        // Availability status
        if (availabilityFilter === 'available' && !item.isAvailable) return false;
        if (availabilityFilter === 'sold_out' && item.isAvailable) return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [items, searchTerm, categoryFilter, availabilityFilter, sortColumn, sortDirection]);

  // Handle column sorting
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Bulk selection handlers
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === processedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedItems.map((item) => item._id));
    }
  };

  const handleBulkAvailability = async (isAvailable) => {
    if (selectedIds.length === 0) return;
    setIsBulkUpdating(true);
    try {
      await bulkToggleAvailability(selectedIds, isAvailable);
      setSelectedIds([]);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Drawer handlers
  const handleOpenAddDrawer = () => {
    setEditingItem(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (editingItem?._id) {
        const res = await updateItem(editingItem._id, formData);
        if (res.success) handleCloseDrawer();
      } else {
        const res = await addItem(formData);
        if (res.success) handleCloseDrawer();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handlers
  const handleRequestDelete = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteItem(itemToDelete._id, itemToDelete.name);
      setItemToDelete(null);
      setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete._id));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-[#0F0F11]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              to="/menu"
              className="p-2 rounded-xl text-stone-500 hover:text-black hover:bg-stone-100 transition-colors border border-stone-200 shrink-0"
              title="Return to customer menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 uppercase tracking-widest">
                  ADMIN MANAGER
                </span>
                <span className="text-xs text-stone-400 font-sans">
                  {user.name}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-title uppercase tracking-tightest text-black mt-0.5 leading-tight">
                Cafeteria Menu Manager
              </h1>
            </div>
          </div>

          {/* Add Item Button */}
          <Button
            variant="primary"
            onClick={handleOpenAddDrawer}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-heading font-bold uppercase tracking-wider text-xs px-5 py-2.5"
          >
            Add New Dish
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col gap-5">
        {/* Metric Summary Chips (app-screens.md format) */}
        <MenuSummaryChips summary={summary} />

        {/* Admin Management Toolbar */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm flex flex-col gap-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dish inventory or ingredients..."
                className="w-full h-10 pl-10 pr-9 bg-[#F8F9FA] text-black placeholder:text-stone-400 text-sm font-sans rounded-xl border border-stone-200 hover:border-stone-300 focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition-all focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-black rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters: Category & Availability */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Category Dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 bg-white border border-stone-200 text-black text-xs font-heading font-semibold rounded-xl focus:border-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-sm"
              >
                <option value="All">All Categories</option>
                {summary.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Availability Filter Dropdown */}
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="h-10 px-3 bg-white border border-stone-200 text-black text-xs font-heading font-semibold rounded-xl focus:border-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="available">In Stock Only</option>
                <option value="sold_out">Sold Out Only</option>
              </select>

              {/* View Toggle (Table / Grid) */}
              <div className="flex items-center bg-[#F8F9FA] p-1 rounded-xl border border-stone-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'table'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-stone-500 hover:text-black'
                  }`}
                  title="Table view"
                  aria-label="Table view"
                >
                  <TableIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-stone-500 hover:text-black'
                  }`}
                  title="Card grid view"
                  aria-label="Card grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Action Bar (Visible when rows are selected) */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black text-white rounded-xl animate-slide-up">
              <span className="text-xs font-mono font-semibold">
                {selectedIds.length} dish{selectedIds.length > 1 ? 'es' : ''} selected
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleBulkAvailability(true)}
                  disabled={isBulkUpdating}
                  className="bg-stone-900 border-stone-700 text-white hover:bg-stone-800"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Mark In Stock
                </Button>

                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleBulkAvailability(false)}
                  disabled={isBulkUpdating}
                  className="bg-stone-900 border-stone-700 text-white hover:bg-stone-800"
                  leftIcon={<AlertOctagon className="w-3.5 h-3.5 text-amber-400" />}
                >
                  Mark Sold Out
                </Button>

                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-stone-400 hover:text-white font-heading font-medium ml-2 transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-sm my-10">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-7 h-7 opacity-60" />
            </div>
            <h3 className="text-lg font-bold font-heading text-black mb-1.5">
              No dishes in catalog yet
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed font-sans">
              Start building your cafeteria inventory by publishing your first dish.
            </p>
            <Button
              variant="primary"
              onClick={handleOpenAddDrawer}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add First Dish
            </Button>
          </div>
        )}

        {/* Items Display: Table or Grid */}
        {!isLoading && items.length > 0 && (
          <>
            {viewMode === 'table' ? (
              <div className="hidden md:block">
                <MenuTable
                  items={processedItems}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onEdit={handleOpenEditDrawer}
                  onDelete={handleRequestDelete}
                  onToggleAvailability={toggleAvailability}
                  selectedIds={selectedIds}
                  onSelectRow={handleSelectRow}
                  onSelectAll={handleSelectAll}
                />
              </div>
            ) : null}

            <div className={viewMode === 'table' ? 'block md:hidden' : 'block'}>
              <MenuGrid
                items={processedItems}
                onEdit={handleOpenEditDrawer}
                onDelete={handleRequestDelete}
                onToggleAvailability={toggleAvailability}
                selectedIds={selectedIds}
                onSelectRow={handleSelectRow}
              />
            </div>
          </>
        )}
      </main>

      {/* Add / Edit Form Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
        subtitle={
          editingItem
            ? `Update details and availability for "${editingItem.name}"`
            : 'Fill in the dish information below to publish it to the customer menu'
        }
      >
        <MenuItemForm
          initialData={editingItem}
          categories={summary.categories}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          isSaving={isSaving}
        />
      </Drawer>

      {/* Delete Item Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu Dish"
        itemName={itemToDelete?.name}
        description="Are you sure you want to remove this dish from the cafeteria menu? It will no longer be visible to customers."
        confirmText="Yes, Delete Dish"
        cancelText="Keep Dish"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MenuManagerPage;
