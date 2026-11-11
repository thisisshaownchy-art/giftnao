'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, totalWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (totalWishlist === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-brand-blush rounded-full flex items-center justify-center text-brand-burgundy">
          <Heart className="w-10 h-10 opacity-60" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark">Your Wishlist is Empty</h1>
        <p className="text-xs sm:text-sm text-brand-dark/70 mt-2 max-w-sm mx-auto">
          Save romantic gifts, chocolates, and personalized keepsakes you'd love to gift or receive.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <span>Discover Romantic Gifts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
          My Saved Wishlist
        </h1>
        <p className="text-xs text-brand-dark/70 mt-1">
          {totalWishlist} romantic item{totalWishlist > 1 ? 's' : ''} saved for later
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
