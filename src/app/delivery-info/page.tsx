'use client';

import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function DeliveryInfoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Shipping & Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          Nationwide Delivery Information
        </h1>
        <p className="text-xs sm:text-sm text-brand-dark/70">
          We ensure safe, protective, and timely delivery across all 64 districts of Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-brand-border space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-burgundy">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-brand-dark">Inside Dhaka Metro</h2>
          <p className="text-xs text-brand-dark/70 leading-relaxed">
            Standard delivery takes <strong>24 to 48 hours</strong> from order confirmation. Flat rate shipping is <strong>৳70</strong>. Express same-day delivery may be coordinated upon prior arrangement with our hotline desk.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-brand-border space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-burgundy">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-brand-dark">Outside Dhaka (All 63 Districts)</h2>
          <p className="text-xs text-brand-dark/70 leading-relaxed">
            Delivery to any district town, upazila, or thana takes <strong>2 to 4 business days</strong>. Flat rate shipping is <strong>৳130</strong> via established nationwide courier networks.
          </p>
        </div>
      </div>

      <div className="bg-brand-cream/60 p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
        <h3 className="font-serif text-base font-bold text-brand-dark">Packaging & Handling Safety</h3>
        <p>
          All romantic gift boxes containing glassware, ceramics, perfumes, or artisanal chocolates are bubble-wrapped and placed within an outer corrugated shipping box to guarantee flawless presentation upon arrival.
        </p>
        <p>
          For temperature-sensitive chocolates, we package with thermal lining to prevent melting during transit in hot weather conditions.
        </p>
      </div>
    </div>
  );
}
