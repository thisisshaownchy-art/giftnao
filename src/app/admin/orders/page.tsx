'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  X,
  CreditCard,
  MapPin,
  Clock,
  Send,
  Banknote,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { StoreService } from '../../../lib/storeService';
import { Order, OrderStatus, PaymentStatus } from '../../../lib/types';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const highlightRef = searchParams.get('highlight') || '';
  const initialStatusFilter = searchParams.get('status') || 'all';

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState(highlightRef);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatusFilter);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Edit fields for active order
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadOrders = () => {
    StoreService.getAllOrders().then((list) => {
      setOrders(list);
      if (highlightRef) {
        const match = list.find((o) => o.orderNumber === highlightRef);
        if (match) {
          setActiveOrder(match);
          setCourierName(match.courierName || 'Steadfast Courier');
          setTrackingNumber(match.trackingNumber || '');
        }
      }
    });
  };

  useEffect(() => {
    loadOrders();
  }, [highlightRef]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.recipientPhone.includes(searchTerm) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || o.orderStatus === selectedStatus;
    const matchesPayment = selectedPaymentStatus === 'all' || o.paymentStatus === selectedPaymentStatus;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await StoreService.updateOrderStatus(orderId, newStatus);
    setActionSuccess(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
    loadOrders();
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, orderStatus: newStatus });
    }
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleVerifyPayment = async (orderId: string, isApproved: boolean) => {
    await StoreService.verifyPayment(orderId, isApproved);
    setActionSuccess(`Payment ${isApproved ? 'Approved & Marked Paid' : 'Rejected'}`);
    loadOrders();
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({
        ...activeOrder,
        paymentStatus: isApproved ? 'paid' : 'failed',
        orderStatus: isApproved ? 'confirmed' : activeOrder.orderStatus,
      });
    }
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleCodCollection = async (orderId: string, collected: boolean) => {
    const ordersList = [...orders];
    const idx = ordersList.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      ordersList[idx].paymentStatus = collected ? 'cod_collected' : 'cod_due';
      localStorage.setItem('giftnao_orders', JSON.stringify(ordersList));
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder({ ...activeOrder, paymentStatus: collected ? 'cod_collected' : 'cod_due' });
      }
      setActionSuccess(`COD status updated to: ${collected ? 'COD Collected' : 'COD Due'}`);
      loadOrders();
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleSaveCourier = (orderId: string) => {
    if (activeOrder && activeOrder.id === orderId) {
      const updated = { ...activeOrder, courierName, trackingNumber };
      setActiveOrder(updated);
      const all = [...orders];
      const idx = all.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        all[idx] = updated;
        localStorage.setItem('giftnao_orders', JSON.stringify(all));
      }
      setActionSuccess('Courier and tracking consignment updated!');
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            Order Fulfillment & Payment Verification
          </h1>
          <p className="text-xs text-brand-dark/60 mt-1">
            Audit customer orders, verify bKash / Nagad / Rocket transaction references, and manage dispatch logistics.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border flex flex-col md:flex-row gap-4 items-center justify-between text-xs shadow-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Order #, phone, TrxID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-cream/30 px-3.5 py-2 pl-9 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy"
          />
          <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-brand-dark/60">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-brand-cream/30 border border-brand-border rounded-xl px-2.5 py-1.5 font-medium"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending_confirmation">Pending Confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="ready_for_dispatch">Ready for Dispatch</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-brand-dark/60">Payment:</span>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="bg-brand-cream/30 border border-brand-border rounded-xl px-2.5 py-1.5 font-medium"
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="awaiting_verification">Awaiting Verification</option>
              <option value="paid">Paid</option>
              <option value="cod_due">COD Due</option>
              <option value="cod_collected">COD Collected</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-brand-dark/60 space-y-2">
            <p className="font-serif text-base font-bold text-brand-dark">No orders found</p>
            <p>No customer orders match your selected search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-cream/60 border-b border-brand-border text-brand-dark/70">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order Ref</th>
                  <th className="py-3 px-4 font-semibold">Customer / Recipient</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-brand-blush/20 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-burgundy">
                      {o.orderNumber}
                      <span className="block text-[10px] text-brand-dark/50 font-sans">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-brand-dark">{o.customerName}</p>
                      <p className="text-[11px] text-brand-dark/60">Phone: {o.customerPhone}</p>
                      {o.isSurpriseGift && (
                        <span className="text-[10px] text-brand-burgundy font-bold">🎁 Surprise Order</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-brand-dark">{o.district}</p>
                      <p className="text-[11px] text-brand-dark/60">{o.area}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold uppercase text-brand-dark">{o.paymentMethod}</span>
                      <div className="mt-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === 'paid' || o.paymentStatus === 'cod_collected'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.paymentStatus === 'awaiting_verification'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-brand-blush text-brand-burgundy'
                          }`}
                        >
                          {o.paymentStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {o.transactionId && (
                        <span className="text-[10px] font-mono text-brand-dark/80 block mt-0.5 font-bold">
                          Trx: {o.transactionId}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-brand-dark text-sm">
                      ৳{o.finalTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                        className="bg-brand-cream/40 border border-brand-border rounded-lg px-2 py-1 text-[11px] font-medium focus:outline-none focus:border-brand-burgundy"
                      >
                        <option value="pending_confirmation">Pending Confirmation</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="ready_for_dispatch">Ready for Dispatch</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveOrder(o);
                          setCourierName(o.courierName || 'Steadfast Courier');
                          setTrackingNumber(o.trackingNumber || '');
                        }}
                        className="px-3 py-1.5 bg-brand-burgundy text-white rounded-xl text-xs font-semibold hover:bg-brand-burgundy-hover transition shadow-xs"
                      >
                        Inspect & Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActiveOrder(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-border p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 text-xs">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <span className="font-mono text-[10px] font-bold text-brand-burgundy">ORDER INSPECTION</span>
                <h2 className="font-serif text-xl font-bold text-brand-dark">{activeOrder.orderNumber}</h2>
                <p className="text-[11px] text-brand-dark/50">Placed on {new Date(activeOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1.5 rounded-full text-brand-dark/50 hover:bg-brand-blush hover:text-brand-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MFS Verification Panel (bKash, Nagad, Rocket) */}
            {(activeOrder.paymentMethod === 'bkash' || activeOrder.paymentMethod === 'nagad' || activeOrder.paymentMethod === 'rocket') && (
              <div className="p-4 bg-brand-blush/40 rounded-2xl border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-burgundy uppercase flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>{activeOrder.paymentMethod} Payment Audit</span>
                  </span>
                  <span className="font-mono font-bold bg-white px-2.5 py-0.5 rounded border border-brand-border">
                    {activeOrder.paymentStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-brand-border/60">
                  <div>
                    <span className="text-[10px] text-brand-dark/50 block font-semibold">Submitted TrxID:</span>
                    <span className="font-mono font-bold text-brand-burgundy text-sm">
                      {activeOrder.transactionId || 'Awaiting submission'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-dark/50 block font-semibold">Sender Phone Number:</span>
                    <span className="font-mono font-bold text-brand-dark">
                      {activeOrder.paymentPhone || activeOrder.customerPhone}
                    </span>
                  </div>
                </div>

                {activeOrder.paymentStatus !== 'paid' && (
                  <div className="pt-1 flex gap-3">
                    <button
                      onClick={() => handleVerifyPayment(activeOrder.id, true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Confirm Payment (Paid)</span>
                    </button>
                    <button
                      onClick={() => handleVerifyPayment(activeOrder.id, false)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Payment (Failed)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* COD Collection Toggle */}
            {activeOrder.paymentMethod === 'cod' && (
              <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-brand-burgundy" />
                  <div>
                    <span className="font-bold text-brand-dark block">Cash on Delivery Status</span>
                    <span className="text-[11px] text-brand-dark/60">
                      Amount Due: ৳{activeOrder.finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCodCollection(activeOrder.id, activeOrder.paymentStatus !== 'cod_collected')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    activeOrder.paymentStatus === 'cod_collected'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-brand-border text-brand-dark hover:bg-brand-blush'
                  }`}
                >
                  {activeOrder.paymentStatus === 'cod_collected' ? '✓ COD Collected' : 'Mark COD Collected'}
                </button>
              </div>
            )}

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 p-3 bg-brand-cream/30 rounded-xl">
                <span className="font-bold text-brand-dark block">Customer (Sender)</span>
                <p>{activeOrder.customerName}</p>
                <p>Phone: {activeOrder.customerPhone}</p>
                {activeOrder.customerEmail && <p>Email: {activeOrder.customerEmail}</p>}
              </div>

              <div className="space-y-1 p-3 bg-brand-cream/30 rounded-xl">
                <span className="font-bold text-brand-dark block">Recipient</span>
                <p>{activeOrder.recipientName}</p>
                <p>Phone: {activeOrder.recipientPhone}</p>
                {activeOrder.isSurpriseGift && <p className="text-brand-burgundy font-bold">🎁 Surprise Order</p>}
              </div>

              <div className="sm:col-span-2 p-3 bg-brand-cream/30 rounded-xl space-y-1">
                <span className="font-bold text-brand-dark block">Delivery Address</span>
                <p>{activeOrder.deliveryAddress}, {activeOrder.area}, {activeOrder.district}</p>
                {activeOrder.addressInstructions && (
                  <p className="text-brand-dark/70 italic">Instructions: {activeOrder.addressInstructions}</p>
                )}
              </div>

              {activeOrder.giftMessage && (
                <div className="sm:col-span-2 p-3 bg-brand-blush/30 rounded-xl space-y-1 border border-brand-border">
                  <span className="font-bold text-brand-burgundy block">Complimentary Parchment Calligraphy Note:</span>
                  <p className="italic">"{activeOrder.giftMessage}"</p>
                </div>
              )}
            </div>

            {/* Courier & Tracking Assignment */}
            <div className="p-4 bg-white border border-brand-border rounded-2xl space-y-3">
              <span className="font-bold text-brand-dark block">Courier Partner & Consignment Reference:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-brand-dark/70 mb-1">Courier Partner:</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. Steadfast, Pathao, RedX"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-brand-dark/70 mb-1">Consignment / Tracking Number:</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. ST-BD-902144"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-mono uppercase"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSaveCourier(activeOrder.id)}
                className="px-4 py-2 bg-brand-burgundy text-white rounded-xl text-xs font-semibold hover:bg-brand-burgundy-hover"
              >
                Update Tracking Information
              </button>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <span className="font-bold text-brand-dark block">Snapshot of Purchased Items:</span>
              <div className="divide-y divide-brand-border/60">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <div>
                      <p className="font-semibold text-brand-dark">{it.productName}</p>
                      <p className="text-[11px] text-brand-dark/60">Qty: {it.quantity} @ ৳{it.unitPrice}</p>
                      {it.personalizationText && (
                        <p className="text-[11px] text-brand-rose italic">Custom: {it.personalizationText}</p>
                      )}
                    </div>
                    <span className="font-serif font-bold text-brand-burgundy">৳{it.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-border pt-3 space-y-1 text-right">
                <p>Items Subtotal: <strong>৳{activeOrder.subtotal.toLocaleString()}</strong></p>
                <p>Shipping Charge ({activeOrder.district}): <strong>৳{activeOrder.shippingCharge}</strong></p>
                {activeOrder.discount > 0 && (
                  <p className="text-emerald-700">Coupon Discount: <strong>-৳{activeOrder.discount}</strong></p>
                )}
                <p className="font-serif text-sm font-bold text-brand-burgundy pt-1">
                  Final Total Payable: ৳{activeOrder.finalTotal.toLocaleString()}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Loading orders console...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
