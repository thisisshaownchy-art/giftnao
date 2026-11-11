'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ShieldCheck, Gift, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Our Story
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          About GiftNao
        </h1>
        <p className="font-serif text-lg text-brand-burgundy italic">
          "Gifts That Speak from the Heart"
        </p>
      </div>

      {/* Main Narrative */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-border space-y-6 text-xs sm:text-sm text-brand-dark/80 leading-relaxed shadow-sm">
        <p>
          Founded with a romantic vision, <strong>GiftNao</strong> is dedicated to transforming thoughtful gestures into cherished lifelong memories. Whether celebrating an anniversary, a midnight birthday surprise, Valentine’s Day, or just an unprompted token of affection, we believe every gift should narrate a deeply personal story.
        </p>

        <p>
          Based in Bangladesh, we take immense pride in our artisan craftsmanship. Each GiftNao signature keepsake box is hand-assembled, wrapped with satin ribbon, scented with delicate florals, and completed with an authentic wax seal. We curate only premium imported chocolates, artisan confections, and personalized keepsakes designed to endure.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-brand-border text-center">
          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy mb-2">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-serif font-bold text-brand-dark">Tender Connection</h3>
            <p className="text-xs text-brand-dark/60">Designed specifically for couples and heartfelt relationships.</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-brand-dark">Artisan Quality</h3>
            <p className="text-xs text-brand-dark/60">Hand-curated packaging, calligraphy cards, and keepsake memory chests.</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-brand-dark">Nationwide Trust</h3>
            <p className="text-xs text-brand-dark/60">Reliable delivery and flexible COD & mobile banking payments.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <span>Explore Our Gift Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
