'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Clock, Heart, Shield } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '../lib/sampleData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-cream border-t border-brand-border text-brand-dark pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-brand-border">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo height={46} />
            <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed max-w-sm">
              GiftNao is Bangladesh's premier destination for thoughtful, romantic, and personalized gifting. We craft tender moments that speak directly from the heart.
            </p>
            
            {/* Contact Placeholders */}
            <div className="space-y-2 pt-2 text-xs text-brand-dark/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-burgundy flex-shrink-0" />
                <span>Hotline: {DEFAULT_STORE_SETTINGS.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-burgundy flex-shrink-0" />
                <span>Email: {DEFAULT_STORE_SETTINGS.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-burgundy flex-shrink-0 mt-0.5" />
                <span>Location: {DEFAULT_STORE_SETTINGS.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-burgundy flex-shrink-0" />
                <span>Support Hours: {DEFAULT_STORE_SETTINGS.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Occasions */}
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-burgundy uppercase tracking-wider mb-4">
              Shop Occasions
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/couple-gifts" className="hover:text-brand-burgundy transition">
                  Couple Gifts
                </Link>
              </li>
              <li>
                <Link href="/category/birthday-gifts" className="hover:text-brand-burgundy transition">
                  Birthday Gifts
                </Link>
              </li>
              <li>
                <Link href="/category/anniversary-gifts" className="hover:text-brand-burgundy transition">
                  Anniversary Gifts
                </Link>
              </li>
              <li>
                <Link href="/category/valentines-day" className="hover:text-brand-burgundy transition">
                  Valentine's Day Gifts
                </Link>
              </li>
              <li>
                <Link href="/category/chocolates-sweets" className="hover:text-brand-burgundy transition">
                  Chocolates & Sweets
                </Link>
              </li>
              <li>
                <Link href="/category/personalized-gifts" className="hover:text-brand-burgundy transition">
                  Personalized Keepsakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-burgundy uppercase tracking-wider mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-brand-burgundy transition">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/delivery-info" className="hover:text-brand-burgundy transition">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-brand-burgundy transition">
                  Returns & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-brand-burgundy transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-burgundy transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-burgundy transition">
                  About GiftNao
                </Link>
              </li>
            </ul>
          </div>

          {/* Safe Payments & Policies */}
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-burgundy uppercase tracking-wider mb-4">
              Payment & Security
            </h3>
            <p className="text-xs text-brand-dark/70 mb-3">
              We support secure payment options across Bangladesh:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-1 bg-white border border-brand-border rounded text-[11px] font-semibold text-brand-burgundy">
                Cash on Delivery
              </span>
              <span className="px-2 py-1 bg-pink-50 border border-pink-200 rounded text-[11px] font-bold text-pink-700">
                bKash
              </span>
              <span className="px-2 py-1 bg-amber-50 border border-amber-200 rounded text-[11px] font-bold text-amber-700">
                Nagad
              </span>
              <span className="px-2 py-1 bg-purple-50 border border-purple-200 rounded text-[11px] font-bold text-purple-700">
                Rocket
              </span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-burgundy transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-burgundy transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-brand-burgundy font-medium flex items-center gap-1 hover:underline">
                  <Shield className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-dark/60 gap-3">
          <p>
            &copy; {new Date().getFullYear()} GiftNao Bangladesh. All rights reserved. Gifts That Speak from the Heart.
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>for heartfelt moments across Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
