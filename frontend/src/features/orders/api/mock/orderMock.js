import { SEED_ORDERS } from './seedOrders';
import { STORAGE_KEYS } from '@/utils/constants';

const delay = (min = 300, max = 550) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      return [...SEED_ORDERS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_ORDERS];
  } catch (err) {
    console.warn('Failed to parse localStorage orders, falling back to seed', err);
    return [...SEED_ORDERS];
  }
};

const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('orders_updated'));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
};

export const orderMock = {
  async getAllOrders(statusFilter = 'all') {
    await delay(250, 450);
    const orders = getStoredOrders().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    if (statusFilter && statusFilter !== 'all') {
      return orders.filter((o) => o.status === statusFilter);
    }
    return orders;
  },

  async getMyOrders(customerId = 'usr_cust_001') {
    await delay(250, 450);
    const orders = getStoredOrders().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return orders.filter(
      (o) => (o.customer?._id || o.customer) === customerId
    );
  },

  async getOrderById(id) {
    await delay(200, 400);
    const orders = getStoredOrders();
    const found = orders.find((o) => o._id === id || o.orderNumber === id);
    if (!found) {
      throw new Error(`Order not found with ID: ${id}`);
    }
    return found;
  },

  async updateOrderStatus(id, status) {
    await delay(250, 450);
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o._id === id || o.orderNumber === id);
    if (index === -1) {
      throw new Error(`Order not found with ID: ${id}`);
    }

    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    saveStoredOrders(orders);
    return orders[index];
  },

  async getSummary() {
    await delay(200, 350);
    const orders = getStoredOrders();
    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) =>
      ['pending', 'preparing', 'ready'].includes(o.status)
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    return {
      totalOrders,
      activeOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      statusBreakdown: {
        pending: orders.filter((o) => o.status === 'pending').length,
        preparing: orders.filter((o) => o.status === 'preparing').length,
        ready: orders.filter((o) => o.status === 'ready').length,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },
    };
  },

  resetToSeed() {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    window.dispatchEvent(new Event('orders_updated'));
    return [...SEED_ORDERS];
  },
};

export default orderMock;