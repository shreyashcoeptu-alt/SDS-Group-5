import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../api/orderApi';
import useCurrentUser from '@/features/menu/hooks/useCurrentUser';
import OrderStatusBadge from '../components/OrderStatusBadge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import formatCurrency from '@/utils/formatCurrency';
import { ArrowLeft, ShoppingBag, ArrowRight, RefreshCw, Utensils } from 'lucide-react';

export const CustomerOrdersPage = () => {
  const { user } = useCurrentUser();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'past'

  const fetchMyOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderApi.getMyOrders(user._id);
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchMyOrders();
    window.addEventListener('orders_updated', fetchMyOrders);
    return () => window.removeEventListener('orders_updated', fetchMyOrders);
  }, [fetchMyOrders]);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return ['pending', 'preparing', 'ready'].includes(o.status);
    if (filter === 'past') return ['completed', 'cancelled'].includes(o.status);
    return true;
  });

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-[#0F0F11]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              to="/menu"
              className="p-2 rounded-xl text-stone-500 hover:text-black hover:bg-stone-100 transition-colors border border-stone-200"
              title="Back to Menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                CUSTOMER PORTAL · {user.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-title uppercase tracking-tight text-black">
                My Orders & History
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-mono">
              <span className="text-stone-500">Total Spent: </span>
              <strong className="text-black font-bold">{formatCurrency(totalSpent)}</strong>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMyOrders}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col gap-5">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: `All Orders (${orders.length})` },
            {
              key: 'active',
              label: `Active (${orders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)).length})`,
            },
            {
              key: 'past',
              label: `PastOrders (${orders.filter((o) => ['completed', 'cancelled'].includes(o.status)).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                filter === tab.key
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} height="140px" className="w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-heading font-bold text-black mb-1">
              No orders found
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              You don't have any orders matching this view yet. Grab something fresh from the cafeteria menu!
            </p>
            <Link to="/menu">
              <Button variant="primary" leftIcon={<Utensils className="w-4 h-4" />}>
                Browse Cafeteria Menu
              </Button>
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm hover:border-black/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-base font-bold font-order font-order-id text-black [font-variant-numeric:tabular-nums] tracking-normal normal-case">
                        {order.orderNumber}
                      </span>
                      <OrderStatusBadge status={order.status} />
                      <span className="text-xs font-mono text-stone-400">
                        {formattedDate}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 font-sans">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(' · ')}
                    </p>

                    {order.specialInstructions && (
                      <p className="text-xs text-stone-400 italic">
                        Note: "{order.specialInstructions}"
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                        Total Amount
                      </span>
                      <span className="text-lg font-mono font-bold text-black tabular-price">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <Link to={`/orders/${order._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Track Status
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerOrdersPage;