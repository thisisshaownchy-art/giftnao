'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-blush/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-burgundy" />
              <h2 className="font-serif text-lg font-bold text-brand-dark">
                Your Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-brand-dark/60 hover:text-brand-burgundy hover:bg-brand-blush transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-blush rounded-full flex items-center justify-center text-brand-burgundy">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-base font-medium text-brand-dark">
                  Your gift bag is empty
                </h3>
                <p className="text-xs text-brand-dark/60 mt-1 max-w-xs mx-auto">
                  Find the perfect romantic surprise or personalized gift for your loved one.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-brand-burgundy text-white rounded-xl text-xs font-semibold hover:bg-brand-burgundy-hover transition"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                  className="flex gap-4 p-3 bg-brand-blush/20 rounded-xl border border-brand-border/60"
                >
                  {/* Image */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-brand-dark truncate">
                      {item.product.name}
                    </h4>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-brand-rose font-medium">
                        Variant: {item.selectedVariant.name}
                      </p>
                    )}
                    {item.personalizationText && (
                      <p className="text-[11px] text-brand-dark/70 italic truncate">
                        Msg: "{item.personalizationText}"
                      </p>
                    )}
                    <div className="font-semibold text-brand-burgundy text-sm mt-1">
                      ৳{(item.product.price + (item.selectedVariant?.priceModifier || 0)).toLocaleString()}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-brand-border rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedVariant?.id
                            )
                          }
                          className="p-1 hover:bg-brand-blush text-brand-dark"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedVariant?.id
                            )
                          }
                          className="p-1 hover:bg-brand-blush text-brand-dark"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedVariant?.id)
                        }
                        className="text-brand-dark/40 hover:text-rose-600 transition p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-brand-border bg-white space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-dark/70">Subtotal:</span>
                <span className="font-serif text-lg font-bold text-brand-burgundy">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-brand-dark/60">
                Delivery charges will be calculated during checkout (৳70 Inside Dhaka / ৳130 Nationwide).
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-xl border border-brand-border text-center text-xs font-semibold text-brand-dark hover:bg-brand-blush transition"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-center text-xs font-semibold transition flex items-center justify-center gap-1 shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
