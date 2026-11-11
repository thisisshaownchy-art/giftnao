'use client';

import React from 'react';
import { Sparkles, Truck, HeartHandshake } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-brand-burgundy text-white text-xs py-2 px-4 border-b border-brand-burgundy-light">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-brand-rose" />
          <span>Nationwide Delivery across all 64 districts of Bangladesh</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-rose" />
          <span className="font-serif italic">Gifts That Speak from the Heart</span>
        </div>
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-3.5 h-3.5 text-brand-rose" />
          <span>Cash on Delivery & bKash / Nagad / Rocket</span>
        </div>
      </div>
    </div>
  );
};
