'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light';
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', height = 48, variant = 'full' }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      {!imageError ? (
        <div className="relative flex items-center" style={{ height: `${height}px` }}>
          <img
            src="/giftnao-logo.jpg"
            alt="GiftNao Logo"
            className="h-full w-auto object-contain max-h-[60px] mix-blend-multiply transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Fallback Vector Emblem */}
          <div className="w-10 h-10 rounded-xl bg-brand-burgundy flex items-center justify-center text-white shadow-md">
            <svg
              className="w-6 h-6 text-brand-rose"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="8" width="18" height="14" rx="2" />
              <path d="M12 8v14" />
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-burgundy leading-none">
              GiftNao
            </span>
            <span className="text-[10px] uppercase tracking-widest text-brand-rose font-medium">
              Gifts From The Heart
            </span>
          </div>
        </div>
      )}
    </Link>
  );
};
