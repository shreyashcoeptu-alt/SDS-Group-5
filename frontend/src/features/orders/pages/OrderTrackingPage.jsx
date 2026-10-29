import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from "../../../api/axiosClient";import OrderStatusBadge from '../components/OrderStatusBadge';
import OrderTrackerStepper from '../components/OrderTrackerStepper';
import Button from '@/components/ui/Button';
import formatCurrency from '@/utils/formatCurrency';
import { ArrowLeft, RefreshCw, Receipt, AlertCircle } from 'lucide-react';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      // Securely fetch the order using axiosClient (which includes your auth token)
      const res = await axiosClient.get(`/orders/${id}`);
      const data = res?.data !== undefined ? res.data : res;
      
      setOrder(data);
      setError(null);
    } catch (err) {
      // Accurately capture the real backend error (e.g., 401, 403, 404)
      setError(err.response?.data?.message || err.message || 'Could not load order');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Poll every 8 seconds for live status updates + listen to local mock events
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 8000);
    window.addEventListener('orders_updated', fetchOrder);
    return () => {
      clearInterval(interval);
      window.removeEventListener('orders_updated', fetchOrder);
    };
  }, [fetchOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <p className="text-sm font-mono text-stone-500 animate-pulse">
          Loading live order tracker...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-md w-full text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-heading font-bold text-black mb-1">
            Order Not Found
          </h2>
          <p className="text-xs text-stone-500 mb-5">{error}</p>
          <Link to="/orders">
            <Button variant="primary">Back to My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-[#0F0F11]">
      <header className="bg-white border-b border-stone-200/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              to="/orders"
              className="p-2 rounded-xl text-stone-500 hover:text-black hover:bg-stone-100 transition-colors border border-stone-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  LIVE ORDER TRACKER
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-order font-order-id text-black mt-1 [font-variant-numeric:tabular-nums] tracking-normal normal-case">
                {order.orderNumber}
              </h1>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrder}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col gap-6">
        {/* Live Progress Stepper */}
        <section className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
              Fulfillment Progress
            </h2>
            <span className="text-xs font-mono text-stone-400">
              Updated {new Date(order.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <OrderTrackerStepper status={order.status} />
        </section>

        {/* Order Receipt & Item Summary */}
        <section className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <Receipt className="w-4 h-4 text-stone-500" />
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-black">
              Order Summary & Bill Breakdown
            </h3>
          </div>

          <div className="divide-y divide-stone-100 my-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-stone-100 text-black">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="text-sm font-heading font-bold text-black">
                      {item.name}
                    </p>
                    <p className="text-xs font-mono text-stone-400">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-black tabular-price">
                  {formatCurrency(item.subtotal || item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {order.specialInstructions && (
            <div className="my-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
              <strong className="font-heading text-black uppercase tracking-wider block mb-0.5">
                Special Instructions:
              </strong>
              {order.specialInstructions}
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                Payment Status: <strong className="text-black">{order.paymentStatus.toUpperCase()}</strong>
              </span>
              <span className="text-sm font-heading font-bold text-black">
                Grand Total
              </span>
            </div>
            <span className="text-2xl font-mono font-bold text-black tabular-price">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderTrackingPage;