'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '../../components/ProductCard';
import { Product } from '../../lib/types';
import { StoreService } from '../../lib/storeService';
import { Search, ArrowRight } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    StoreService.searchProducts(query).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Search Results
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-dark mt-1">
          {query ? `Results for "${query}"` : 'Search GiftNao'}
        </h1>
        <p className="text-xs text-brand-dark/70 mt-1">
          {loading ? 'Searching catalog...' : `Found ${products.length} gift match${products.length === 1 ? '' : 'es'}`}
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-brand-border" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-border p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
            <Search className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="font-serif text-lg font-bold text-brand-dark">No gifts matched your search</h2>
          <p className="text-xs text-brand-dark/70 mt-2 leading-relaxed">
            Try searching for terms like <span className="font-semibold text-brand-burgundy">"chocolate"</span>, <span className="font-semibold text-brand-burgundy">"couple"</span>, <span className="font-semibold text-brand-burgundy">"romantic"</span>, or <span className="font-semibold text-brand-burgundy">"birthday"</span>.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-brand-burgundy text-white rounded-xl text-xs font-semibold hover:bg-brand-burgundy-hover transition flex items-center gap-1.5"
            >
              <span>Browse All Gifts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
