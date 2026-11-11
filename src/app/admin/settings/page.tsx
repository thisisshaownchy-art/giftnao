'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  Store, 
  Megaphone,
  Share2,
  FileText
} from 'lucide-react';
import { StoreService } from '../../../lib/storeService';
import { StoreSettings } from '../../../lib/types';
import { DEFAULT_STORE_SETTINGS } from '../../../lib/sampleData';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'shipping' | 'announcements'>('general');

  useEffect(() => {
    StoreService.getStoreSettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await StoreService.updateStoreSettings(settings);
    setNotice('Store settings and payment configuration saved successfully!');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            Store & Business Configuration
          </h1>
          <p className="text-xs text-brand-dark/60 mt-1">
            Configure contact hotlines, bKash / Nagad / Rocket receiving numbers, and delivery charges.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-brand-border overflow-x-auto text-xs font-semibold space-x-2">
        {[
          { key: 'general', label: '1. Brand & Contact', icon: Store },
          { key: 'payments', label: '2. Payment Accounts (MFS)', icon: CreditCard },
          { key: 'shipping', label: '3. Shipping Rates', icon: Truck },
          { key: 'announcements', label: '4. Notices & Hero', icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-3.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-brand-burgundy text-brand-burgundy font-bold'
                  : 'border-transparent text-brand-dark/60 hover:text-brand-burgundy'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* TAB 1: GENERAL & CONTACT */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 shadow-xs text-xs animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border pb-3">
              Official Business Identity & Concierge Hotline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl bg-brand-cream/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Customer Helpline / Hotline</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">WhatsApp Order Desk Number</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-brand-dark mb-1">Fulfillment / Studio Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-brand-dark mb-1">Customer Service Working Hours</label>
                <input
                  type="text"
                  value={settings.businessHours}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Instagram Profile URL</label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENT ACCOUNTS */}
        {activeTab === 'payments' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 shadow-xs text-xs animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border pb-3">
              Receiving Accounts for Mobile Financial Services (bKash / Nagad / Rocket)
            </h2>
            <p className="text-[11px] text-brand-dark/60">
              Customers paying manually via MFS will send money or pay to these designated numbers during checkout.
            </p>

            <div className="space-y-4 pt-2">
              {/* bKash */}
              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-pink-900 mb-1">bKash Receiving Number</label>
                  <input
                    type="text"
                    value={settings.bkashNumber}
                    onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-300 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-pink-900 mb-1">bKash Account Type</label>
                  <select
                    value={settings.bkashType}
                    onChange={(e) => setSettings({ ...settings, bkashType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-pink-300 rounded-xl font-medium"
                  >
                    <option value="Personal">Personal (Send Money)</option>
                    <option value="Merchant">Merchant (Payment)</option>
                  </select>
                </div>
              </div>

              {/* Nagad */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-amber-900 mb-1">Nagad Receiving Number</label>
                  <input
                    type="text"
                    value={settings.nagadNumber}
                    onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-amber-900 mb-1">Nagad Account Type</label>
                  <select
                    value={settings.nagadType}
                    onChange={(e) => setSettings({ ...settings, nagadType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-medium"
                  >
                    <option value="Personal">Personal (Send Money)</option>
                    <option value="Merchant">Merchant (Payment)</option>
                  </select>
                </div>
              </div>

              {/* Rocket */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 mb-1">Rocket Receiving Number</label>
                  <input
                    type="text"
                    value={settings.rocketNumber}
                    onChange={(e) => setSettings({ ...settings, rocketNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-900 mb-1">Rocket Account Type</label>
                  <select
                    value={settings.rocketType}
                    onChange={(e) => setSettings({ ...settings, rocketType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl font-medium"
                  >
                    <option value="Personal">Personal (Send Money)</option>
                    <option value="Merchant">Merchant (Payment)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SHIPPING RATES */}
        {activeTab === 'shipping' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 shadow-xs text-xs animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border pb-3">
              Standard Nationwide Delivery Charges
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Inside Dhaka Metro (৳ BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-brand-dark/40">৳</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.insideDhakaShipping}
                    onChange={(e) => setSettings({ ...settings, insideDhakaShipping: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2.5 border border-brand-border rounded-xl font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-brand-dark/50 mt-1">Default: ৳70</p>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Outside Dhaka — All 63 Districts (৳ BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-brand-dark/40">৳</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.outsideDhakaShipping}
                    onChange={(e) => setSettings({ ...settings, outsideDhakaShipping: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2.5 border border-brand-border rounded-xl font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-brand-dark/50 mt-1">Default: ৳130</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTICES */}
        {activeTab === 'announcements' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 shadow-xs text-xs animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border pb-3">
              Header Announcement Bar & Notice
            </h2>

            <div>
              <label className="block font-semibold text-brand-dark mb-1">
                Top Announcement Bar Text
              </label>
              <textarea
                rows={2}
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl"
              />
              <p className="text-[10px] text-brand-dark/50 mt-1">
                Displayed continuously on the very top burgundy banner across all pages.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Store Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
