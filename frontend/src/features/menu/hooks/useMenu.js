import { useState, useEffect, useCallback, useMemo } from 'react';
import menuApi from '../api/menuApi';
import { useToast } from '@/components/ui/Toast';

/**
 * Custom hook to manage menu state, optimistic updates, and cache mutations.
 */
export const useMenu = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await menuApi.getMenu();
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err.message || 'Unable to load menu items');
      toast.error(err.message || 'Unable to load menu items', 'Fetch Failed');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  /**
   * Add a new item to the menu
   */
  const addItem = useCallback(async (itemData) => {
    try {
      const newItem = await menuApi.createItem(itemData);
      setItems((prev) => [newItem, ...prev]);
      toast.success(`"${newItem.name}" added to menu`, 'Item Created');
      return { success: true, item: newItem };
    } catch (err) {
      toast.error(err.message || 'Failed to create menu item', 'Create Error');
      return { success: false, error: err.message };
    }
  }, [toast]);

  /**
   * Update an existing item
   */
  const updateItem = useCallback(async (id, itemData) => {
    try {
      const updated = await menuApi.updateItem(id, itemData);
      setItems((prev) => prev.map((item) => (item._id === id ? updated : item)));
      toast.success(`"${updated.name}" updated successfully`, 'Changes Saved');
      return { success: true, item: updated };
    } catch (err) {
      toast.error(err.message || 'Failed to update menu item', 'Update Error');
      return { success: false, error: err.message };
    }
  }, [toast]);

  /**
   * Toggle item availability with optimistic UI update and rollback on failure
   */
  const toggleAvailability = useCallback(async (id, isAvailable) => {
    // Save previous snapshot for rollback
    let previousItem = null;
    setItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          previousItem = { ...item };
          return { ...item, isAvailable };
        }
        return item;
      })
    );

    try {
      await menuApi.setAvailability(id, isAvailable);
      const label = isAvailable ? 'available' : 'sold out';
      toast.info(`Marked as ${label}`, 'Availability Updated');
      return { success: true };
    } catch (err) {
      // Rollback on failure
      if (previousItem) {
        setItems((prev) =>
          prev.map((item) => (item._id === id ? previousItem : item))
        );
      }
      toast.error(err.message || 'Could not update availability', 'Update Failed');
      return { success: false, error: err.message };
    }
  }, [toast]);

  /**
   * Bulk toggle availability
   */
  const bulkToggleAvailability = useCallback(async (ids, isAvailable) => {
    const idSet = new Set(ids);
    const prevItems = [...items];

    // Optimistic bulk update
    setItems((prev) =>
      prev.map((it) => (idSet.has(it._id) ? { ...it, isAvailable } : it))
    );

    try {
      await menuApi.bulkSetAvailability(ids, isAvailable);
      const label = isAvailable ? 'available' : 'sold out';
      toast.success(
        `Marked ${ids.length} item${ids.length > 1 ? 's' : ''} as ${label}`,
        'Bulk Update Complete'
      );
      return { success: true };
    } catch (err) {
      // Rollback
      setItems(prevItems);
      toast.error(err.message || 'Failed to apply bulk update', 'Bulk Update Failed');
      return { success: false, error: err.message };
    }
  }, [items, toast]);

  /**
   * Delete an item
   */
  const deleteItem = useCallback(async (id, itemName = 'Item') => {
    try {
      await menuApi.deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success(`"${itemName}" deleted from menu`, 'Item Deleted');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete item', 'Delete Failed');
      return { success: false, error: err.message };
    }
  }, [toast]);

  // Derived summaries & metrics
  const summary = useMemo(() => {
    const total = items.length;
    const available = items.filter((i) => i.isAvailable).length;
    const soldOut = total - available;
    const uniqueCategories = Array.from(
      new Set(items.map((i) => (i.category || '').trim()).filter(Boolean))
    ).sort();

    return {
      total,
      available,
      soldOut,
      categoriesCount: uniqueCategories.length,
      categories: uniqueCategories,
    };
  }, [items]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchMenu,
    addItem,
    updateItem,
    toggleAvailability,
    bulkToggleAvailability,
    deleteItem,
    summary,
  };
};

export default useMenu;
