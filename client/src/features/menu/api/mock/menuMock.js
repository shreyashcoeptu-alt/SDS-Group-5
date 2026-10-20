import { SEED_MENU_ITEMS } from './seedMenu';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * In-memory + LocalStorage mock database for Menu & Food Management.
 * Simulates realistic network latency (400-700ms) and provides CRUD operations.
 */

const delay = (min = 400, max = 700) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getStoredItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(SEED_MENU_ITEMS));
      return [...SEED_MENU_ITEMS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_MENU_ITEMS];
  } catch (err) {
    console.warn('Failed to parse localStorage menu items, falling back to seed', err);
    return [...SEED_MENU_ITEMS];
  }
};

const saveStoredItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save menu items to localStorage', err);
  }
};

export const menuMock = {
  /**
   * Fetch all menu items
   */
  async getMenu() {
    await delay(350, 600);
    return getStoredItems();
  },

  /**
   * Create a new menu item
   */
  async createItem(itemData) {
    await delay(450, 750);

    if (!itemData.name || itemData.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (!itemData.category || !itemData.category.trim()) {
      throw new Error('Category is required');
    }
    if (!itemData.price || isNaN(Number(itemData.price)) || Number(itemData.price) <= 0) {
      throw new Error('Price must be greater than 0');
    }
    if (!itemData.description || !itemData.description.trim()) {
      throw new Error('Description is required');
    }

    const items = getStoredItems();
    const newItem = {
      _id: `menu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: itemData.name.trim(),
      category: itemData.category.trim(),
      price: Math.round(Number(itemData.price) * 100) / 100,
      description: itemData.description.trim(),
      image: itemData.image?.trim() || '',
      isVeg: Boolean(itemData.isVeg),
      isAvailable: itemData.isAvailable !== undefined ? Boolean(itemData.isAvailable) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...items];
    saveStoredItems(updated);
    return newItem;
  },

  /**
   * Update an existing menu item
   */
  async updateItem(id, itemData) {
    await delay(400, 700);

    const items = getStoredItems();
    const index = items.findIndex((it) => it._id === id);
    if (index === -1) {
      throw new Error(`Menu item not found with id: ${id}`);
    }

    const current = items[index];
    const updatedItem = {
      ...current,
      name: itemData.name !== undefined ? itemData.name.trim() : current.name,
      category: itemData.category !== undefined ? itemData.category.trim() : current.category,
      price: itemData.price !== undefined ? Math.round(Number(itemData.price) * 100) / 100 : current.price,
      description: itemData.description !== undefined ? itemData.description.trim() : current.description,
      image: itemData.image !== undefined ? itemData.image.trim() : current.image,
      isVeg: itemData.isVeg !== undefined ? Boolean(itemData.isVeg) : current.isVeg,
      isAvailable: itemData.isAvailable !== undefined ? Boolean(itemData.isAvailable) : current.isAvailable,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    saveStoredItems(items);
    return updatedItem;
  },

  /**
   * Toggle item availability
   */
  async setAvailability(id, isAvailable) {
    await delay(250, 450);

    const items = getStoredItems();
    const index = items.findIndex((it) => it._id === id);
    if (index === -1) {
      throw new Error(`Menu item not found with id: ${id}`);
    }

    items[index] = {
      ...items[index],
      isAvailable: Boolean(isAvailable),
      updatedAt: new Date().toISOString(),
    };

    saveStoredItems(items);
    return items[index];
  },

  /**
   * Bulk toggle availability
   */
  async bulkSetAvailability(ids, isAvailable) {
    await delay(400, 650);
    const idSet = new Set(ids);
    const items = getStoredItems();

    const updated = items.map((item) => {
      if (idSet.has(item._id)) {
        return {
          ...item,
          isAvailable: Boolean(isAvailable),
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    saveStoredItems(updated);
    return { success: true, count: ids.length, isAvailable };
  },

  /**
   * Delete an item
   */
  async deleteItem(id) {
    await delay(350, 600);

    const items = getStoredItems();
    const filtered = items.filter((it) => it._id !== id);
    if (filtered.length === items.length) {
      throw new Error(`Menu item not found with id: ${id}`);
    }

    saveStoredItems(filtered);
    return { success: true, id };
  },

  /**
   * Reset store to initial seed data
   */
  resetToSeed() {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(SEED_MENU_ITEMS));
    return [...SEED_MENU_ITEMS];
  },
};

export default menuMock;
