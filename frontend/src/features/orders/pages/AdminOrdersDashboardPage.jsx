import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import OrderSummaryMetrics from '../components/OrderSummaryMetrics';
import StaffOrderCard from '../components/StaffOrderCard';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  RefreshCw,
  Search,
  UtensilsCrossed,
  ClipboardList,
} from 'lucide-react';

export const AdminOrdersDashboardPage = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'all' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allOrders, summaryData] = await Promise.all([
        orderApi.getAllOrders('all'),
        orderApi.getSummary(),
      ]);
      setOrders(allOrders || []);
      setSummary(summaryData || {});
    } catch (err) {
      toast.error(err.message || 'Failed to load orders dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
      const updatedSummary = await orderApi.getSummary();
      setSummary(updatedSummary);
      toast.success(
        `Order ${updated.orderNumber} marked as ${newStatus.toUpperCase()}`,
        'Status Updated'
      );
    } catch (err) {
      toast.error(err.message || 'Could not update order status');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter === 'active') {
        if (!['pending', 'preparing', 'ready'].includes(order.status)) return false;
      } else if (statusFilter !== 'all') {
        if (order.status !== statusFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchOrderNum = (order.orderNumber || '').toLowerCase().includes(q);
        const matchCustomer = (order.customer?.name || '').toLowerCase().includes(q);
        const matchDish = order.items?.some((i) =>
          (i.name || '').toLowerCase().includes(q)
        );
        if (!matchOrderNum && !matchCustomer && !matchDish) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-[#0F0F11]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              to="/menu"
              className="p-2 rounded-xl text-stone-500 hover:text-black hover:bg-stone-100 transition-colors border border-stone-200"
              title="Back to Customer Menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-white bg-black px-2 py-0.5 rounded uppercase tracking-widest">
                  STAFF & ADMIN BOARD
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  LIVE INCOMING QUEUE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-title uppercase tracking-tight text-black mt-0.5">
                Kitchen Orders & Sales Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/admin/menu">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<UtensilsCrossed className="w-3.5 h-3.5" />}
              >
                Menu Manager
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={fetchDashboardData}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Board
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col gap-6">
        {/* Summary & Totals KPI Strip */}
        <OrderSummaryMetrics summary={summary} />

        {/* Filter & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            {[
              { key: 'active', label: `Active Queue (${summary.activeOrders || 0})` },
              { key: 'pending', label: `Pending (${summary.statusBreakdown?.pending || 0})` },
              { key: 'preparing', label: `Preparing (${summary.statusBreakdown?.preparing || 0})` },
              { key: 'ready', label: `Ready (${summary.statusBreakdown?.ready || 0})` },
              { key: 'completed', label: `Completed (${summary.completedOrders || 0})` },
              { key: 'cancelled', label: `Cancelled (${summary.cancelledOrders || 0})` },
              { key: 'all', label: `All (${summary.totalOrders || 0})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider shrink-0 transition-all ${
                  statusFilter === tab.key
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, student, dish..."
              className="w-full h-9.5 pl-9 pr-3 bg-[#F8F9FA] text-black placeholder:text-stone-400 text-xs font-sans rounded-xl border border-stone-200 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Incoming Orders Grid */}
        {!isLoading && filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-6 shadow-sm">
            <ClipboardList className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-heading font-bold text-black mb-1">
              No orders in this queue
            </h3>
            <p className="text-xs text-stone-500">
              Incoming student orders matching this status will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <StaffOrderCard
                key={order._id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersDashboardPage;