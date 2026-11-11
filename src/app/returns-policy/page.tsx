'use client';

import React from 'react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Customer Protection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          Returns, Refunds & Cancellation Policy
        </h1>
        <p className="text-xs text-brand-dark/60">Last updated: October 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-brand-border space-y-6 text-xs sm:text-sm text-brand-dark/80 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">1. Cancellation Policy</h2>
          <p>
            You may cancel your order free of charge as long as the order is in <strong>Pending Confirmation</strong> status. Once personalized engraving has commenced or perishable confectionery has been packed, cancellations cannot be accepted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">2. Damaged or Incorrect Items</h2>
          <p>
            In the rare event that an item arrives damaged or differs from your order confirmation, please take an unboxing photograph or short video and notify our customer service desk within <strong>24 hours</strong> of receipt. We will arrange a replacement or full refund immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">3. Non-Returnable Items</h2>
          <p>
            Due to hygiene, food safety, and custom craftsmanship regulations in Bangladesh, the following items cannot be returned unless verified as damaged on delivery:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Customized photo plaques, engraved wooden albums, and custom cards.</li>
            <li>Opened confectionery, chocolates, or food items.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">4. Refund Method & Processing Time</h2>
          <p>
            Approved refunds will be returned via the original payment method (bKash, Nagad, Rocket, or bank transfer) within 3–7 business days following investigation.
          </p>
        </section>
      </div>
    </div>
  );
}
