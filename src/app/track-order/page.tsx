'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Gift 
} from 'lucide-react';
import { StoreService } from '../../lib/storeService';
import { Order, OrderStatus } from '../../lib/types';

const ORDER_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'pending_confirmation', label: 'Order Received', description: 'Pending artisan confirmation' },
  { status: 'confirmed', label: 'Confirmed', description: 'Payment verified & order approved' },
  { status: 'processing', label: 'Artisan Packaging', description: 'Handcrafted packing & wax sealing' },
  { status: 'ready_for_dispatch', label: 'Ready for Dispatch', description: 'Packed and queued for courier' },
  { status: 'shipped', label: 'In Transit', description: 'With courier partner en route' },
  { status: 'delivered', label: 'Delivered', description: 'Safely delivered to recipient' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      setLoading(true);
      StoreService.getOrderByIdOrTracking(initialOrderNumber).then((res) => {
        setOrder(res);
        setLoading(false);
        setSearched(true);
      });
    }
  }, [initialOrderNumber]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!orderNumber.trim()) {
      setError('Please provide your Order Number.');
      return;
    }

    setLoading(true);
    setSearched(true);
    const result = await StoreService.getOrderByIdOrTracking(orderNumber.trim(), phoneNumber.trim());
    setOrder(result);
    setLoading(false);

    if (!result) {
      setError('No matching order found. Please verify your Order Number and phone number.');
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return ORDER_STEPS.findIndex((s) => s.status === status);
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Real-Time Updates
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          Track Your Gift Hamper
        </h1>
        <p className="text-xs sm:text-sm text-brand-dark/70">
          Enter your Order Number and the phone number used during checkout to track fulfillment.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Order Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GN-2026-1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Phone Number (Sender or Recipient)
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track Order Status'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Results */}
      {order && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-sm space-y-8 animate-in fade-in">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-border gap-4">
            <div>
              <span className="text-xs text-brand-dark/60">Order Reference</span>
              <h2 className="font-serif text-2xl font-bold text-brand-burgundy">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-brand-dark/70">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-brand-dark/60 block">Current Status</span>
              <span className="inline-block px-3 py-1 bg-brand-blush text-brand-burgundy font-bold text-xs rounded-full uppercase tracking-wider">
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-6">
              Fulfillment Journey
            </h3>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div key={step.status} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 text-left md:text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 ${
                          isCompleted
                            ? 'bg-brand-burgundy text-white shadow-md'
                            : 'bg-brand-blush text-brand-dark/40 border border-brand-border'
                        } ${isCurrent ? 'ring-4 ring-brand-rose/40' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <p className={`text-xs font-bold ${isCompleted ? 'text-brand-dark' : 'text-brand-dark/50'}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-brand-dark/60 mt-0.5 max-w-[120px] md:mx-auto">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Courier details if shipped */}
          {(order.courierName || order.trackingNumber) && (
            <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-border space-y-1 text-xs">
              <span className="font-bold text-brand-dark block">Courier Information:</span>
              {order.courierName && <p>Partner: <span className="font-semibold">{order.courierName}</span></p>}
              {order.trackingNumber && <p>Courier Consignment: <span className="font-mono font-bold text-brand-burgundy">{order.trackingNumber}</span></p>}
            </div>
          )}

          {/* Destination Details */}
          <div className="border-t border-brand-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-brand-dark/60 block">Delivery Address:</span>
              <span className="font-medium text-brand-dark">
                {order.deliveryAddress}, {order.area}, {order.district}
              </span>
            </div>
            <div>
              <span className="text-brand-dark/60 block">Payment Method & Status:</span>
              <span className="font-semibold text-brand-burgundy capitalize">
                {order.paymentMethod.toUpperCase()} — {order.paymentStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Support notice */}
      <div className="text-center text-xs text-brand-dark/60">
        Need assistance with your delivery? Contact our care desk at{' '}
        <Link href="/contact" className="text-brand-burgundy font-semibold hover:underline">
          Customer Support
        </Link>
        .
      </div>

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
