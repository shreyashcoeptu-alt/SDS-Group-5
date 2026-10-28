import axiosClient from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { orderMock } from './mock/orderMock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const orderApi = {
  async getAllOrders(status = 'all') {
    if (USE_MOCKS) {
      return orderMock.getAllOrders(status);
    }
    const params = status && status !== 'all' ? { status } : {};
    const res = await axiosClient.get(API_ENDPOINTS.ORDERS, { params });
    return Array.isArray(res) ? res : res.data || [];
  },

  async getMyOrders(customerId) {
    if (USE_MOCKS) {
      return orderMock.getMyOrders(customerId);
    }
    const res = await axiosClient.get(API_ENDPOINTS.MY_ORDERS);
    return Array.isArray(res) ? res : res.data || [];
  },

  async getOrderById(id) {
    if (USE_MOCKS) {
      return orderMock.getOrderById(id);
    }
    const res = await axiosClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
    return res.data || res;
  },

  async updateOrderStatus(id, status) {
    if (USE_MOCKS) {
      return orderMock.updateOrderStatus(id, status);
    }
    const res = await axiosClient.patch(API_ENDPOINTS.ORDER_STATUS(id), { status });
    return res.data || res;
  },

  async getSummary() {
    if (USE_MOCKS) {
      return orderMock.getSummary();
    }
    const res = await axiosClient.get(API_ENDPOINTS.ORDER_SUMMARY);
    return res.data || res;
  },

  resetMockOrders() {
    if (USE_MOCKS) {
      return orderMock.resetToSeed();
    }
  },
};

export default orderApi;