import React, { useState } from 'react';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '../context/CartContext';
import axiosClient from '@/api/axiosClient';

export default function CartDrawer({ isOpen, onClose }) {
    const { items, updateQuantity, removeItem, clearCart, subtotal, gst, grandTotal } = useCart();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setLoading(true);
        try {
            const payload = {
                items: items.map((i) => ({
                    menuItem: i._id || i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    subtotal: i.subtotal,
                })),
                totalAmount: grandTotal,
                paymentMethod: 'cash',
                specialInstructions: notes,
            };

            await axiosClient.post('/orders', payload);
            toast.success('Order placed successfully!', 'Success');
            clearCart();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="Your Order Cart">
            <div className="flex flex-col h-full justify-between">
                {items.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">Your cart is empty.</div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-4 p-4">
                        {items.map((item) => (
                            <div key={item._id || item.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <h4 className="font-semibold">{item.name}</h4>
                                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateQuantity(item._id || item.id, -1)}
                                        className="px-2 py-1 bg-gray-200 rounded"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id || item.id, 1)}
                                        className="px-2 py-1 bg-gray-200 rounded text-black"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeItem(item._id || item.id)}
                                        className="text-red-500 text-sm ml-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Special Instructions</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Extra spicy, no onions..."
                                className="w-full border rounded p-2 text-sm"
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {items.length > 0 && (
                    <div className="border-t p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>GST (5%)</span>
                            <span>{formatCurrency(gst)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(grandTotal)}</span>
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full mt-2 py-3"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </div>
                )}
            </div>
        </Drawer>
    );
}