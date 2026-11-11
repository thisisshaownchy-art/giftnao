'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Heart, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-brand-blush rounded-full flex items-center justify-center text-brand-burgundy">
          <ShoppingBag className="w-10 h-10 opacity-60" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark">Your Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-brand-dark/70 mt-2 max-w-sm mx-auto">
          You haven't added any romantic hampers or personalized gifts to your bag yet.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <span>Explore Gift Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-brand-dark/70 mt-1">
          Review your selected gifts ({totalItems} item{totalItems > 1 ? 's' : ''})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Item List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
              className="p-5 bg-white rounded-2xl border border-brand-border/80 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-brand-blush/30"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-brand-burgundy uppercase tracking-wider">
                    {item.product.category}
                  </span>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-serif text-base font-bold text-brand-dark hover:text-brand-burgundy transition block"
                  >
                    {item.product.name}
                  </Link>
                  {item.personalizationText && (
                    <p className="text-xs text-brand-dark/70 italic">
                      Personalization: "{item.personalizationText}"
                    </p>
                  )}
                  {item.giftMessage && (
                    <p className="text-xs text-brand-dark/60 italic">
                      Card Note: "{item.giftMessage}"
                    </p>
                  )}
                  <p className="text-xs font-semibold text-brand-burgundy">
                    ৳{item.product.price.toLocaleString()} each
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 self-end sm:self-center">
                <div className="flex items-center border border-brand-border rounded-xl bg-white shadow-xs">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity - 1,
                        item.selectedVariant?.id
                      )
                    }
                    className="p-2 text-brand-dark hover:bg-brand-blush rounded-l-xl transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity + 1,
                        item.selectedVariant?.id
                      )
                    }
                    className="p-2 text-brand-dark hover:bg-brand-blush rounded-r-xl transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="font-serif text-base font-bold text-brand-burgundy">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                  className="p-2 text-brand-dark/40 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm space-y-6">
          <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-border pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-brand-dark/80">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-brand-dark">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span className="text-brand-burgundy font-medium">Calculated at Checkout</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Handwritten Card & Packaging:</span>
              <span className="font-semibold">Complimentary</span>
            </div>

            <div className="border-t border-brand-border pt-3 flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-brand-dark">Subtotal</span>
              <span className="font-serif text-2xl font-bold text-brand-burgundy">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="border-t border-brand-border/60 pt-4 space-y-2 text-[11px] text-brand-dark/70">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-brand-burgundy" />
              <span>Flat shipping: ৳70 Inside Dhaka • ৳130 Outside Dhaka</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-burgundy" />
              <span>Safe payment: Cash on Delivery or bKash / Nagad / Rocket</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
