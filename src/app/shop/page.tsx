'use client';

import React, { useEffect, useState } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { Product } from '../../lib/types';
import { StoreService } from '../../lib/storeService';
import { OCCASIONS_LIST } from '../../lib/sampleData';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  useEffect(() => {
    StoreService.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products
    .filter((p) => {
      if (selectedOccasion !== 'all') {
        const matchesCat = p.categorySlug === selectedOccasion;
        const matchesOcc = p.occasions.some(
          (o) => o.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedOccasion
        );
        if (!matchesCat && !matchesOcc) return false;
      }
      if (p.price > maxPrice) return false;
      if (inStockOnly && p.stockQuantity <= 0) return false;
      return true;
    })
    .sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
          Shop All Curated Gifts
        </h1>
        <p className="text-xs sm:text-sm text-brand-dark/70 mt-2">
          Discover hand-crafted hampers, artisan chocolates, and personalized keepsakes designed to delight your loved ones.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Occasion / Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedOccasion('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              selectedOccasion === 'all'
                ? 'bg-brand-burgundy text-white'
                : 'bg-brand-blush/60 text-brand-dark hover:bg-brand-blush'
            }`}
          >
            All Gifts
          </button>
          {OCCASIONS_LIST.map((item) => (
            <button
              key={item.slug}
              onClick={() => setSelectedOccasion(item.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedOccasion === item.slug
                  ? 'bg-brand-burgundy text-white'
                  : 'bg-brand-blush/60 text-brand-dark hover:bg-brand-blush'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Sort & Quick Filter Options */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-brand-dark/70">Max Price: ৳{maxPrice}</label>
            <input
              type="range"
              min="500"
              max="5000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-brand-burgundy w-24 sm:w-32 cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-brand-dark">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded accent-brand-burgundy"
            />
            <span>In Stock Only</span>
          </label>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-burgundy" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-brand-blush/50 border border-brand-border rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-brand-burgundy text-brand-dark font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-brand-border" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-brand-border p-8">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
            <Filter className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-dark">No gifts found</h3>
          <p className="text-xs text-brand-dark/70 mt-1">
            Try adjusting your price range or clearing occasion filters.
          </p>
          <button
            onClick={() => {
              setSelectedOccasion('all');
              setMaxPrice(5000);
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-brand-burgundy text-white rounded-xl text-xs font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
