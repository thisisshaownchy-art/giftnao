'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS_DATA = [
  {
    q: 'How does nationwide delivery work across Bangladesh?',
    a: 'We deliver inside Dhaka metropolitan area within 24–48 hours, and to all other 63 districts in Bangladesh within 2–4 business days via verified courier services (such as Steadfast and Pathao). All orders are carefully packed in shock-resistant packaging.'
  },
  {
    q: 'Can I send a secret or surprise gift without receipts?',
    a: 'Yes, absolutely! At checkout, simply check the "This is a Surprise Gift" box. We will omit all commercial price receipts from the box and will not disclose the contents to the recipient prior to hand delivery.'
  },
  {
    q: 'What payment methods can I use?',
    a: 'We accept Cash on Delivery (COD) in eligible delivery zones, as well as manual mobile banking payments via bKash, Nagad, and Rocket. When paying via mobile banking, submit your Transaction ID on the confirmation screen for admin verification.'
  },
  {
    q: 'Are custom handwritten notes included?',
    a: 'Yes! Every GiftNao gift hamper includes an optional complimentary parchment gift note written in elegant calligraphy with your personalized words.'
  },
  {
    q: 'How can I track my order once placed?',
    a: 'Go to our "Track My Order" page and enter your Order Number (e.g. GN-2026-1001) along with your contact phone number. You can see real-time updates from packaging to final courier delivery.'
  },
  {
    q: 'Can I cancel or modify my order after placing it?',
    a: 'Orders can be cancelled or altered as long as they are in "Pending Confirmation" status. Once our artisans begin custom engraving or packaging, orders cannot be cancelled. Contact our hotline immediately if you need adjustments.'
  }
];

export default function FAQsPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          Help & Answers
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-brand-dark/70">
          Everything you need to know about ordering, delivery, and payments at GiftNao.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS_DATA.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-semibold text-brand-dark hover:text-brand-burgundy transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-burgundy flex-shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-brand-dark/80 leading-relaxed border-t border-brand-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
