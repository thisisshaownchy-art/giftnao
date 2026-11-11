'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Smartphone, 
  Banknote, 
  Clock, 
  Copy, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { StoreService } from '../../lib/storeService';
import { Order, StoreSettings } from '../../lib/types';
import { DEFAULT_STORE_SETTINGS } from '../../lib/sampleData';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Manual transaction submission
  const [trxId, setTrxId] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [isSubmittingTrx, setIsSubmittingTrx] = useState(false);
  const [trxSuccessMessage, setTrxSuccessMessage] = useState('');
  const [trxError, setTrxError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      StoreService.getOrderByIdOrTracking(orderNumber).then((res) => {
        setOrder(res);
        setLoading(false);
      });
      StoreService.getStoreSettings().then(setSettings);
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrxError('');
    if (!trxId.trim() || !paymentPhone.trim()) {
      setTrxError('Please enter both your Transaction ID and the phone number used for payment.');
      return;
    }

    setIsSubmittingTrx(true);
    const success = await StoreService.submitPaymentTransaction(orderNumber, trxId.trim(), paymentPhone.trim());
    setIsSubmittingTrx(false);

    if (success) {
      setTrxSuccessMessage('Transaction details received! Our admin team will verify your payment shortly.');
      // Refresh order
      StoreService.getOrderByIdOrTracking(orderNumber).then(setOrder);
    } else {
      setTrxError('Failed to record transaction. Please try again or contact customer care.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-brand-burgundy border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-dark/70">Retrieving order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Order Reference Not Found</h1>
        <p className="text-xs text-brand-dark/70 mt-2">
          We could not locate this order. If you recently placed an order, please check your confirmation SMS or visit Track Order.
        </p>
        <Link href="/" className="mt-6 inline-block px-5 py-2.5 bg-brand-burgundy text-white rounded-xl text-xs font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  const isMFS = order.paymentMethod === 'bkash' || order.paymentMethod === 'nagad' || order.paymentMethod === 'rocket';
  const mfsConfig = {
    bkash: { name: 'bKash', number: settings.bkashNumber, type: settings.bkashType, color: 'text-pink-600', bg: 'bg-pink-50' },
    nagad: { name: 'Nagad', number: settings.nagadNumber, type: settings.nagadType, color: 'text-amber-600', bg: 'bg-amber-50' },
    rocket: { name: 'Rocket', number: settings.rocketNumber, type: settings.rocketType, color: 'text-purple-600', bg: 'bg-purple-50' },
  }[order.paymentMethod as 'bkash' | 'nagad' | 'rocket'] || { name: 'MFS', number: '01XXXXXXXXX', type: 'Personal', color: 'text-brand-burgundy', bg: 'bg-brand-blush' };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Banner */}
      <div className="bg-white p-8 rounded-3xl border border-brand-border text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
          Order Received with Love!
        </h1>
        <p className="text-xs sm:text-sm text-brand-dark/70 max-w-md mx-auto">
          Thank you for choosing GiftNao. Your order <strong className="text-brand-burgundy">{order.orderNumber}</strong> has been logged in our system.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blush text-brand-burgundy text-xs font-semibold">
          <Clock className="w-4 h-4" />
          <span>Status: {order.orderStatus.replace(/_/g, ' ').toUpperCase()}</span>
        </div>
      </div>

      {/* Manual Payment Panel for bKash / Nagad / Rocket */}
      {isMFS && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-brand-burgundy/30 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-border pb-4">
            <div className={`w-10 h-10 rounded-xl ${mfsConfig.bg} flex items-center justify-center ${mfsConfig.color}`}>
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-brand-dark">
                {mfsConfig.name} Payment Instructions
              </h2>
              <p className="text-xs text-brand-dark/60">
                Complete your transfer to initiate artisan packing.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-brand-cream/60 p-4 rounded-2xl border border-brand-border text-xs leading-relaxed">
            <p className="font-bold text-brand-dark">How to Pay via {mfsConfig.name}:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-brand-dark/80">
              <li>Open your {mfsConfig.name} app or dial the USSD code.</li>
              <li>Select <strong>Send Money</strong> (for Personal) or <strong>Make Payment</strong> (for Merchant).</li>
              <li>
                Send exact total of <strong className="text-brand-burgundy">৳{order.finalTotal.toLocaleString()}</strong> to:
                <div className="my-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-border rounded-xl font-mono text-sm font-bold text-brand-dark">
                  <span>{mfsConfig.number}</span>
                  <span className="text-[10px] bg-brand-blush px-2 py-0.5 rounded text-brand-burgundy font-sans">
                    {mfsConfig.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber(mfsConfig.number)}
                    className="p-1 hover:text-brand-burgundy transition"
                    title="Copy number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied && <span className="text-[10px] text-emerald-600 font-sans">Copied!</span>}
                </div>
              </li>
              <li>Use Reference: <strong className="font-mono">{order.orderNumber}</strong></li>
              <li>Save your Transaction ID (TrxID) and submit it below.</li>
            </ol>
          </div>

          {/* Submission Form */}
          {order.transactionId ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Transaction Submitted</span>
              </div>
              <p className="text-emerald-700">
                Transaction ID: <span className="font-mono font-bold">{order.transactionId}</span>
              </p>
              <p className="text-emerald-700">
                Payment Status: <span className="font-bold">{order.paymentStatus.replace(/_/g, ' ').toUpperCase()}</span>
              </p>
              <p className="text-[11px] text-emerald-600/90 pt-1">
                Our verification team is auditing the incoming transfer. Once validated, your order will transition to Confirmed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTrx} className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-brand-dark">
                Submit Your {mfsConfig.name} Transaction ID
              </h3>

              {trxError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{trxError}</span>
                </div>
              )}

              {trxSuccessMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{trxSuccessMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Your {mfsConfig.name} Phone Number:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Transaction ID (TrxID):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BL92KJ78X"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy font-mono uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingTrx}
                className="w-full py-3 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-bold rounded-xl transition shadow-md disabled:opacity-50"
              >
                {isSubmittingTrx ? 'Submitting Details...' : 'Submit Transaction ID'}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Security Note:</strong> GiftNao will NEVER ask for your PIN, OTP, or mobile banking passwords.
                </span>
              </div>
            </form>
          )}
        </div>
      )}

      {/* COD Notice */}
      {order.paymentMethod === 'cod' && (
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-burgundy flex-shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-sm font-bold text-brand-dark">
              Cash on Delivery (COD) Selected
            </h3>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Please keep the exact amount of <strong className="text-brand-burgundy">৳{order.finalTotal.toLocaleString()}</strong> ready in cash. Our delivery partner will collect this payment upon hand-delivering your package.
            </p>
          </div>
        </div>
      )}

      {/* Order Details Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
        <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border pb-3">
          Order Summary & Delivery Destination
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-brand-dark/60 block">Sender / Customer:</span>
            <span className="font-semibold text-brand-dark">{order.customerName} ({order.customerPhone})</span>
          </div>
          <div>
            <span className="text-brand-dark/60 block">Recipient:</span>
            <span className="font-semibold text-brand-dark">{order.recipientName} ({order.recipientPhone})</span>
            {order.isSurpriseGift && (
              <span className="text-[10px] text-brand-burgundy font-bold block">🎁 Surprise Delivery</span>
            )}
          </div>
          <div className="sm:col-span-2">
            <span className="text-brand-dark/60 block">Delivery Address:</span>
            <span className="font-medium text-brand-dark">
              {order.deliveryAddress}, {order.area}, {order.district}
            </span>
          </div>
          {order.giftMessage && (
            <div className="sm:col-span-2 p-3 bg-brand-blush/30 rounded-xl border border-brand-border/60">
              <span className="text-[11px] font-bold text-brand-burgundy block mb-0.5">Complimentary Card Note:</span>
              <span className="text-xs italic text-brand-dark/80">"{order.giftMessage}"</span>
            </div>
          )}
        </div>

        {/* Item table */}
        <div className="border-t border-brand-border pt-4 space-y-3">
          <span className="text-xs font-bold text-brand-dark block">Items in this Hamper:</span>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-medium text-brand-dark">{item.productName}</span>
                <span className="text-brand-dark/60"> x {item.quantity}</span>
                {item.personalizationText && (
                  <span className="text-[11px] text-brand-rose italic block">
                    Custom: {item.personalizationText}
                  </span>
                )}
              </div>
              <span className="font-semibold text-brand-burgundy">
                ৳{item.subtotal.toLocaleString()}
              </span>
            </div>
          ))}

          <div className="border-t border-brand-border/60 pt-3 space-y-1.5 text-xs text-brand-dark/80">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>৳{order.shippingCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-dark pt-1 border-t border-brand-border/40">
              <span>Total Payable:</span>
              <span className="text-brand-burgundy font-serif text-base">
                ৳{order.finalTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/track-order?orderNumber=${order.orderNumber}`}
          className="px-6 py-3 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold text-center transition flex items-center justify-center gap-2 shadow-md"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Track this Order</span>
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-brand-border bg-white hover:bg-brand-blush text-brand-dark text-xs font-semibold text-center transition"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Loading order confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
