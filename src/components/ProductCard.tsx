'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../lib/types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-brand-border/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-brand-blush/40">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBestseller && (
            <span className="bg-brand-burgundy text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              Bestseller
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? 'bg-brand-burgundy text-white'
              : 'bg-white/80 text-brand-dark hover:bg-white hover:text-brand-burgundy'
          } shadow-sm`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-medium text-brand-burgundy uppercase tracking-wider block mb-1">
            {product.category}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="font-serif text-base sm:text-lg font-semibold text-brand-dark group-hover:text-brand-burgundy transition line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-brand-dark/70 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold text-brand-burgundy">
                ৳{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-brand-dark/40 line-through">
                  ৳{product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stockQuantity <= 0}
            className="p-2 sm:px-3 sm:py-2 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
