import axiosClient from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';

export const orderApi = {
  async getAllOrders(status = 'all') {
    const params = status && status !== 'all' ? { status } : {};
    const res = await axiosClient.get(API_ENDPOINTS.ORDERS, { params });
    const data = res?.data !== undefined ? res.data : res;
    // Extract orders array safely whether wrapped in a success object or direct array
    return Array.isArray(data) ? data : data?.orders || [];
  },

  async getMyOrders() {
    const res = await axiosClient.get(API_ENDPOINTS.MY_ORDERS);
    const data = res?.data !== undefined ? res.data : res;
    return Array.isArray(data) ? data : data?.orders || [];
  },

  async getOrderById(id) {
    const res = await axiosClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
    return res?.data !== undefined ? res.data : res;
  },

  async updateOrderStatus(id, status) {
    const res = await axiosClient.patch(API_ENDPOINTS.ORDER_STATUS(id), { status });
    return res?.data !== undefined ? res.data : res;
  },

  async getSummary() {
    const res = await axiosClient.get(API_ENDPOINTS.ORDER_SUMMARY);
    return res?.data !== undefined ? res.data : res;
  },
};

export default orderApi;