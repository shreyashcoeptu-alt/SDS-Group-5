import axiosClient from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { menuMock } from './mock/menuMock';

/**
 * Flag determining if we are running against local mock store or live Express backend.
 * Default is true unless explicitly set to 'false' in .env.
 */
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

/**
 * Menu API Service
 * Handles network requests with fallback to local mock store.
 */
export const menuApi = {
  /**
   * Fetch all menu items
   * @returns {Promise<Array<MenuItem>>}
   */
  async getMenu() {
    if (USE_MOCKS) {
      return menuMock.getMenu();
    }
    const response = await axiosClient.get(API_ENDPOINTS.MENU);
    // Backend may return { success: true, data: [...] } or direct array [...]
    return Array.isArray(response) ? response : (response.data || response.items || []);
  },

  /**
   * Create a new menu item
   * @param {Object} itemData
   * @returns {Promise<MenuItem>}
   */
  async createItem(itemData) {
    if (USE_MOCKS) {
      return menuMock.createItem(itemData);
    }
    const response = await axiosClient.post(API_ENDPOINTS.MENU, itemData);
    return response.data || response;
  },

  /**
   * Update an existing menu item
   * @param {string} id
   * @param {Object} itemData
   * @returns {Promise<MenuItem>}
   */
  async updateItem(id, itemData) {
    if (USE_MOCKS) {
      return menuMock.updateItem(id, itemData);
    }
    const response = await axiosClient.put(API_ENDPOINTS.MENU_ITEM(id), itemData);
    return response.data || response;
  },

  /**
   * Update availability status of an item (optimistic toggle)
   * @param {string} id
   * @param {boolean} isAvailable
   * @returns {Promise<MenuItem>}
   */
  async setAvailability(id, isAvailable) {
    if (USE_MOCKS) {
      return menuMock.setAvailability(id, isAvailable);
    }
    const response = await axiosClient.patch(API_ENDPOINTS.MENU_AVAILABILITY(id), { isAvailable });
    return response.data || response;
  },

  /**
   * Bulk update availability for multiple items
   * @param {Array<string>} ids
   * @param {boolean} isAvailable
   */
  async bulkSetAvailability(ids, isAvailable) {
    if (USE_MOCKS) {
      return menuMock.bulkSetAvailability(ids, isAvailable);
    }
    // If backend doesn't have a bulk route, execute in parallel
    const promises = ids.map((id) =>
      axiosClient.patch(API_ENDPOINTS.MENU_AVAILABILITY(id), { isAvailable })
    );
    await Promise.all(promises);
    return { success: true, count: ids.length, isAvailable };
  },

  /**
   * Delete a menu item by ID
   * @param {string} id
   * @returns {Promise<{ success: boolean, id: string }>}
   */
  async deleteItem(id) {
    if (USE_MOCKS) {
      return menuMock.deleteItem(id);
    }
    const response = await axiosClient.delete(API_ENDPOINTS.MENU_ITEM(id));
    return response.data || response;
  },

  /**
   * Reset mock store to seed data
   */
  resetMockData() {
    if (USE_MOCKS) {
      return menuMock.resetToSeed();
    }
  },

  isMockMode() {
    return USE_MOCKS;
  },
};

export default menuApi;
