import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import axiosClient from '../../api/axiosClient';

export const CartDrawer = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    totalAmount,
    totalItemsCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;
  
  const handleRazorpayPayment = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Request order token from backend
      const res = await axiosClient.post('/payment/create-order', {
        amount: totalAmount,
      });

      // Handle both unwrapped and standard Axios responses
      const orderPayload = res?.data !== undefined ? res.data : res;

      if (!orderPayload || (!orderPayload.success && !orderPayload.order && !orderPayload.id)) {
        throw new Error(orderPayload?.message || 'Failed to initialize payment gateway');
      }

      const rzpOrder = orderPayload.order || orderPayload;

      // 2. Configure Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TrSdcBrqn3Oi1E',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'The Lunchroom',
        description: `Order Payment (${totalItemsCount} items)`,
        order_id: rzpOrder.id,
        theme: { color: '#0F172A' },
        handler: async function (response) {
          try {
            // 3. Verify signature on backend
            const verifyRes = await axiosClient.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const verifyData = verifyRes?.data !== undefined ? verifyRes.data : verifyRes;

            if (verifyData && verifyData.success === false) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            // 4. Create verified order in MongoDB
            const orderBody = {
              items: items.map((i) => ({
                menuItem: i.menuItem,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                subtotal: i.subtotal,
              })),
              totalAmount,
              specialInstructions: instructions,
              paymentStatus: 'paid',
              paymentId: response.razorpay_payment_id,
            };

            const orderCreationRes = await axiosClient.post('/orders', orderBody);
            const createdOrder = orderCreationRes?.data !== undefined ? orderCreationRes.data : orderCreationRes;

            clearCart();
            setIsCartOpen(false);

            // 5. Navigate to Live Status Tracking Page
            const targetId = createdOrder?._id || createdOrder?.id || createdOrder?.order?._id || createdOrder?.order?.id;
            navigate(targetId ? `/orders/${targetId}` : '/orders');
          } catch (err) {
            console.error('Order creation error:', err);
            setErrorMsg(err.response?.data?.message || err.message || 'Payment processing failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Your Cart ({totalItemsCount})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-xl font-semibold px-2"
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.menuItem}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex-1 pr-2">
                  <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">₹{item.price} each</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.menuItem, -1)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem, 1)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="text-right pl-3">
                  <p className="font-bold text-sm text-gray-900">₹{item.subtotal}</p>
                  <button
                    onClick={() => removeItem(item.menuItem)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="pt-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Special Cooking Instructions:
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Less spicy, no cutlery needed"
                className="w-full text-xs p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                rows="2"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-2 text-xs bg-red-50 border border-red-200 text-red-600 rounded">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t">
              <span>Total Payable</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="w-full mt-3 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Initializing Payment...' : `Pay ₹${totalAmount} via Razorpay`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};