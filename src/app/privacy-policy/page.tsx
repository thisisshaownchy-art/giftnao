'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Data Protection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          Privacy Policy
        </h1>
        <p className="text-xs text-brand-dark/60">Compliant with applicable consumer and privacy standards in Bangladesh</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-brand-border space-y-6 text-xs sm:text-sm text-brand-dark/80 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">1. Information We Collect</h2>
          <p>
            When placing an order with GiftNao, we collect necessary transactional details: sender name, recipient name, contact phone numbers, delivery address, and optional personal messages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">2. Handwritten Messages & Personalization Privacy</h2>
          <p>
            We treat your love notes, romantic confessions, and customized gift card messages with the utmost confidentiality. They are only viewed by designated artisan calligraphers and are never shared publicly or used for promotional activities without express written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">3. Payment Security & MFS Privacy</h2>
          <p>
            GiftNao NEVER requests, stores, or processes your personal mobile banking PINs, account passwords, or OTPs. All mobile financial transactions (bKash, Nagad, Rocket) occur securely through your own banking interface, and we only collect the reference Transaction ID (TrxID) for verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-brand-dark">4. Courier Data Sharing</h2>
          <p>
            We share only essential delivery information (recipient name, address, phone number) with verified logistics partners solely for fulfillment purposes.
          </p>
        </section>
      </div>
    </div>
  );
}
