'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { StoreService } from '../../lib/storeService';
import { BANGLADESH_DISTRICTS } from '../../lib/sampleData';
import { PaymentMethod, OrderItemSnapshot } from '../../lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  const [isDifferentRecipient, setIsDifferentRecipient] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [isSurpriseGift, setIsSurpriseGift] = useState(false);

  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressInstructions, setAddressInstructions] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  // Shipping calculation
  const isDhaka = district.trim().toLowerCase() === 'dhaka';
  const shippingCharge = isDhaka ? 70 : 130;
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingCharge;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponMessage('');
    if (!couponCode.trim()) return;

    const res = await StoreService.validateCoupon(couponCode.trim(), subtotal);
    if (res.valid) {
      setDiscountAmount(res.discount);
      setAppliedCoupon(couponCode.trim().toUpperCase());
      setCouponMessage(res.message);
    } else {
      setDiscountAmount(0);
      setAppliedCoupon('');
      setCouponError(res.message);
    }
  };

  // Validation
  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.startsWith('01');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!validatePhone(customerPhone)) {
      setErrorMessage('Please provide a valid 11-digit Bangladeshi phone number (e.g., 017XXXXXXXX).');
      return;
    }

    if (isDifferentRecipient) {
      if (!recipientName.trim()) {
        setErrorMessage('Please enter the recipient full name.');
        return;
      }
      if (!validatePhone(recipientPhone)) {
        setErrorMessage('Please enter a valid 11-digit Bangladeshi recipient phone number.');
        return;
      }
    }

    if (!district || !area.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please complete all delivery address fields (District, Area/Thana, Full Address).');
      return;
    }

    setSubmitting(true);

    try {
      // Create snapshots
      const itemSnapshots: OrderItemSnapshot[] = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        variantName: item.selectedVariant?.name,
        personalizationText: item.personalizationText,
      }));

      const finalRecipientName = isDifferentRecipient ? recipientName : customerName;
      const finalRecipientPhone = isDifferentRecipient ? recipientPhone : customerPhone;

      const order = await StoreService.createOrder({
        customerName,
        customerPhone,
        customerEmail,
        recipientName: finalRecipientName,
        recipientPhone: finalRecipientPhone,
        isSurpriseGift,
        district,
        area,
        deliveryAddress,
        addressInstructions,
        giftMessage,
        items: itemSnapshots,
        subtotal,
        shippingCharge,
        discount: discountAmount,
        finalTotal,
        couponCode: appliedCoupon || undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_due' : 'pending',
        orderStatus: 'pending_confirmation',
      });

      clearCart();
      router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Your bag is empty</h1>
        <p className="text-xs text-brand-dark/70 mt-2">Add gifts to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="mt-6 inline-block px-5 py-2.5 bg-brand-burgundy text-white rounded-xl text-xs font-semibold">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
          Secure Checkout
        </h1>
        <p className="text-xs text-brand-dark/70 mt-1">
          Complete your delivery details for nationwide fulfillment across Bangladesh.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Delivery & Customer Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer / Sender Information */}
          <div className="bg-white p-6 rounded-3xl border border-brand-border/80 shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border/60 pb-3">
              1. Your Contact Information (Sender)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Phone Number (11 Digits) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Email Address (Optional for order invoice)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>

            {/* Surprise Gift Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer bg-brand-blush/40 p-3 rounded-xl border border-brand-border">
                <input
                  type="checkbox"
                  checked={isSurpriseGift}
                  onChange={(e) => setIsSurpriseGift(e.target.checked)}
                  className="accent-brand-burgundy rounded"
                />
                <div>
                  <span className="text-xs font-bold text-brand-burgundy block">
                    This is a Surprise Gift! 🎁
                  </span>
                  <span className="text-[11px] text-brand-dark/70">
                    We will omit price receipts inside the box and keep the delivery secret until arrival.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-white p-6 rounded-3xl border border-brand-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <h2 className="font-serif text-base font-bold text-brand-dark">
                2. Recipient & Delivery Address
              </h2>
              <label className="flex items-center gap-2 text-xs font-medium text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDifferentRecipient}
                  onChange={(e) => setIsDifferentRecipient(e.target.checked)}
                  className="accent-brand-burgundy rounded"
                />
                <span>Sending to someone else?</span>
              </label>
            </div>

            {isDifferentRecipient && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-brand-blush/20 rounded-xl border border-brand-border/60">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Recipient Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required={isDifferentRecipient}
                    placeholder="Recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1">
                    Recipient Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required={isDifferentRecipient}
                    placeholder="01XXXXXXXXX"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
                  />
                </div>
              </div>
            )}

            {/* Address fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  District <span className="text-rose-600">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
                >
                  {BANGLADESH_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} {dist === 'Dhaka' ? '(Inside Dhaka - ৳70)' : '(Outside Dhaka - ৳130)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Area / Thana / Upazila <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhanmondi / Uttara / Mirpur"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Full Street Address, House & Road No <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House #, Road #, Apartment / Flat No, Landmark..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Delivery or Landmark Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave with gate security if unavailable"
                  value={addressInstructions}
                  onChange={(e) => setAddressInstructions(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Complimentary Gift Message (Handwritten Card)
                </label>
                <textarea
                  rows={2}
                  placeholder="Write a sweet romantic message to be handwritten inside our signature card..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector (4 choices) */}
          <div className="bg-white p-6 rounded-3xl border border-brand-border/80 shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border/60 pb-3">
              3. Select Payment Method
            </h2>

            <div className="space-y-3">
              {/* 1. COD */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-brand-burgundy bg-brand-blush/40'
                    : 'border-brand-border hover:bg-brand-blush/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-brand-burgundy mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-brand-burgundy" />
                    <span className="text-xs font-bold text-brand-dark">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-brand-dark/70 mt-1 leading-relaxed">
                    Pay the total amount in cash to the delivery rider upon receiving your package.
                  </p>
                </div>
              </label>

              {/* 2. bKash */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/50'
                    : 'border-brand-border hover:bg-pink-50/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="accent-pink-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-bold text-brand-dark">bKash Manual Payment</span>
                    <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded">bKash MFS</span>
                  </div>
                  <p className="text-[11px] text-brand-dark/70 mt-1 leading-relaxed">
                    Send Money to our bKash account and provide your Transaction ID on the next step.
                  </p>
                </div>
              </label>

              {/* 3. Nagad */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'nagad'
                    ? 'border-amber-600 bg-amber-50/50'
                    : 'border-brand-border hover:bg-amber-50/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="nagad"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="accent-amber-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-brand-dark">Nagad Manual Payment</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded">Nagad MFS</span>
                  </div>
                  <p className="text-[11px] text-brand-dark/70 mt-1 leading-relaxed">
                    Send Money to our Nagad account and submit your Transaction ID for verification.
                  </p>
                </div>
              </label>

              {/* 4. Rocket */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'rocket'
                    ? 'border-purple-600 bg-purple-50/50'
                    : 'border-brand-border hover:bg-purple-50/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="rocket"
                  checked={paymentMethod === 'rocket'}
                  onChange={() => setPaymentMethod('rocket')}
                  className="accent-purple-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-brand-dark">Rocket Manual Payment</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">Rocket DBBL</span>
                  </div>
                  <p className="text-[11px] text-brand-dark/70 mt-1 leading-relaxed">
                    Send Money to our Rocket account and submit your Transaction ID for verification.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Summary: Items & Place Order (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm sticky top-28 space-y-6">
            <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-border pb-3">
              Order Review ({cart.length} Item{cart.length > 1 ? 's' : ''})
            </h2>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                  className="flex gap-3 items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-brand-dark truncate">{item.product.name}</p>
                      <p className="text-[11px] text-brand-dark/60">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-brand-burgundy whitespace-nowrap">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Redemption */}
            <div className="border-t border-brand-border pt-3 space-y-2 text-xs">
              <span className="font-semibold text-brand-dark block">Promo Coupon Code</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GIFTNAO10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-brand-border rounded-xl font-mono uppercase bg-brand-cream/30 text-xs"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-1.5 bg-brand-burgundy text-white rounded-xl font-semibold hover:bg-brand-burgundy-hover transition text-xs"
                >
                  Apply
                </button>
              </div>
              {couponMessage && <p className="text-[11px] text-emerald-700 font-medium">✓ {couponMessage}</p>}
              {couponError && <p className="text-[11px] text-rose-700 font-medium">✕ {couponError}</p>}
            </div>

            {/* Breakdown */}
            <div className="border-t border-brand-border pt-4 space-y-2.5 text-xs text-brand-dark/80">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-brand-dark">৳{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon}):</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({district}):</span>
                <span className="font-semibold text-brand-burgundy">৳{shippingCharge}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Luxury Packaging & Wax Seal:</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="border-t border-brand-border pt-3 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-brand-dark">Total Payable:</span>
                <span className="font-serif text-2xl font-bold text-brand-burgundy">
                  ৳{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-bold tracking-wide shadow-lg shadow-brand-burgundy/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order (৳{finalTotal.toLocaleString()})</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-brand-dark/60 text-center leading-relaxed">
              By confirming your order, you agree to GiftNao's Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
