'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Agreement
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          Terms & Conditions
        </h1>
        <p className="text-xs text-brand-dark/60">Governing purchases on GiftNao in Bangladesh</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-brand-border space-y-6 text-xs sm:text-sm text-brand-dark/80 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">1. Acceptance of Terms</h2>
          <p>
            By accessing the GiftNao website and placing an order, you agree to comply with and be bound by these Terms and Conditions and our Privacy Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">2. Product Specifications & Pricing</h2>
          <p>
            All prices are stated in Bangladeshi Taka (BDT). While we make every effort to display product dimensions, weights, and ingredients accurately, artisan variations may occur in handcrafted floral and gift presentations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">3. Delivery Commitments</h2>
          <p>
            Delivery timelines are estimates provided in good faith. Natural disruptions, hartals, or extreme weather conditions may influence courier schedules. We will communicate any delays promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">4. Surprise Gift Delivery</h2>
          <p>
            When selecting the Surprise Gift option, you warrant that the provided recipient phone number is valid and that the recipient will be reachable at the designated delivery address.
          </p>
        </section>
      </div>
    </div>
  );
}
