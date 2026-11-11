'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '../../../components/ProductCard';
import { Product } from '../../../lib/types';
import { StoreService } from '../../../lib/storeService';
import { OCCASIONS_LIST } from '../../../lib/sampleData';
import { ArrowLeft, Gift } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const occasionInfo = OCCASIONS_LIST.find((o) => o.slug === slug);
  const title = occasionInfo ? occasionInfo.name : slug.replace(/-/g, ' ').toUpperCase();
  const description = occasionInfo
    ? occasionInfo.description
    : `Explore thoughtful ${title} delivered anywhere in Bangladesh with GiftNao.`;

  useEffect(() => {
    if (slug) {
      StoreService.getProductsByCategory(slug).then((data) => {
        setProducts(data);
        setLoading(false);
      });
    }
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs text-brand-dark/60">
        <Link href="/" className="hover:text-brand-burgundy transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-burgundy transition">
          Occasions
        </Link>
        <span>/</span>
        <span className="text-brand-burgundy font-semibold">{title}</span>
      </div>

      {/* Hero Category Banner */}
      <div className="bg-gradient-to-r from-brand-blush via-brand-cream to-white p-6 sm:p-10 rounded-3xl border border-brand-border/70 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
            GiftNao Occasion Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
            {description}
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-xl border border-brand-border bg-white hover:bg-brand-blush text-brand-burgundy text-xs font-semibold transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-brand-border" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-border p-8">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
            <Gift className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="font-serif text-lg font-bold text-brand-dark">No gifts found in this category yet</h2>
          <p className="text-xs text-brand-dark/70 mt-1 max-w-md mx-auto">
            Our artisans are curating new romantic surprises for {title}. Browse our full catalog in the meantime!
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center justify-center px-6 py-2.5 bg-brand-burgundy text-white rounded-xl text-xs font-semibold hover:bg-brand-burgundy-hover transition shadow-sm"
          >
            Explore All Gifts
          </Link>
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
