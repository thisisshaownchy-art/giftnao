'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { StoreService } from '../../lib/storeService';
import { StoreSettings } from '../../lib/types';
import { DEFAULT_STORE_SETTINGS } from '../../lib/sampleData';

export default function ContactPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  useEffect(() => {
    StoreService.getStoreSettings().then(setSettings);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentNotice(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSentNotice(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
          We are here for you
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
          Contact GiftNao Support
        </h1>
        <p className="text-xs sm:text-sm text-brand-dark/70">
          Have an inquiry about an upcoming anniversary, custom hamper, or delivery timeline? Reach out to our friendly concierge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* Contact Information (2 cols) */}
        <div className="md:col-span-2 bg-brand-burgundy text-white p-8 rounded-3xl space-y-6 shadow-md">
          <div>
            <h2 className="font-serif text-xl font-bold">Contact Concierge</h2>
            <p className="text-xs text-brand-rose/90 mt-1">
              Serving customers nationwide across Bangladesh.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-brand-rose block font-semibold">Customer Helpline</span>
                <span>{settings.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-brand-rose block font-semibold">WhatsApp Order Desk</span>
                <span>{settings.whatsapp}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-brand-rose block font-semibold">Inquiries & Support</span>
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-brand-rose block font-semibold">Fulfillment Center</span>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-brand-rose block font-semibold">Customer Service Hours</span>
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-[11px] text-brand-rose/80">
            Note: All business contact details are configurable in the Admin Portal.
          </div>
        </div>

        {/* Message Inquiry Form (3 cols) */}
        <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-brand-border shadow-xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-brand-dark">Send Us a Direct Message</h2>
          
          {sentNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Thank you for reaching out! A concierge representative will respond shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-brand-dark mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Nusrat Jahan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-brand-dark mb-1">Your Message or Custom Request</label>
              <textarea
                required
                rows={4}
                placeholder="Let us know how we can assist your special surprise..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
