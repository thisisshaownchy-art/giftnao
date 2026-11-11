'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TicketPercent, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  X, 
  Calendar, 
  DollarSign, 
  Percent,
  Check,
  AlertCircle
} from 'lucide-react';
import { StoreService } from '../../../lib/storeService';
import { Coupon } from '../../../lib/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [notice, setNotice] = useState('');

  const loadData = () => {
    setLoading(true);
    StoreService.getCoupons().then((res) => {
      setCoupons(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code || !editingCoupon.discountValue) return;

    const coupon: Coupon = {
      id: editingCoupon.id || `cpn_${Date.now()}`,
      code: editingCoupon.code.trim().toUpperCase(),
      discountType: editingCoupon.discountType || 'percentage',
      discountValue: Number(editingCoupon.discountValue),
      minPurchase: Number(editingCoupon.minPurchase || 0),
      maxDiscount: editingCoupon.maxDiscount ? Number(editingCoupon.maxDiscount) : undefined,
      expiryDate: editingCoupon.expiryDate || undefined,
      usageLimit: editingCoupon.usageLimit ? Number(editingCoupon.usageLimit) : undefined,
      timesUsed: editingCoupon.timesUsed || 0,
      isActive: editingCoupon.isActive !== false,
      createdAt: editingCoupon.createdAt || new Date().toISOString(),
    };

    await StoreService.saveCoupon(coupon);
    setNotice(`Coupon "${coupon.code}" successfully saved!`);
    setEditingCoupon(null);
    loadData();
    setTimeout(() => setNotice(''), 3000);
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      await StoreService.deleteCoupon(id);
      setNotice(`Coupon "${code}" deleted.`);
      loadData();
      setTimeout(() => setNotice(''), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs text-brand-dark/60 mt-1">
            Configure romantic promo vouchers, minimum cart thresholds, and usage limits.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingCoupon({
              code: '',
              discountType: 'percentage',
              discountValue: 10,
              minPurchase: 1000,
              isActive: true,
            })
          }
          className="px-4 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cream/60 border-b border-brand-border text-brand-dark/70">
              <tr>
                <th className="py-3 px-4 font-semibold">Promo Code</th>
                <th className="py-3 px-4 font-semibold">Discount</th>
                <th className="py-3 px-4 font-semibold">Min. Cart Spend</th>
                <th className="py-3 px-4 font-semibold">Usage & Limits</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-brand-blush/20 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-burgundy text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-brand-dark">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`}
                    {c.maxDiscount && (
                      <span className="block text-[10px] text-brand-dark/50">
                        Max Cap: ৳{c.maxDiscount}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    ৳{c.minPurchase.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-brand-dark">
                      {c.timesUsed} {c.usageLimit ? `/ ${c.usageLimit} uses` : 'used'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-brand-dark/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setEditingCoupon(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-border p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-serif text-lg font-bold text-brand-dark">Create Promo Coupon</h3>
              <button onClick={() => setEditingCoupon(null)} className="p-1 text-brand-dark/50 hover:bg-brand-blush rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">Coupon Code (e.g. LOVE2026)</label>
                <input
                  type="text"
                  required
                  placeholder="GIFTNAO15"
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.discountType || 'percentage'}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (৳ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingCoupon.discountValue || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Min Cart Spend (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon.minPurchase || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minPurchase: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Max Cap (৳ - Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={editingCoupon.maxDiscount || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isActive !== false}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                    className="accent-brand-burgundy rounded"
                  />
                  <span className="font-semibold text-brand-dark">Active for checkout redemption</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 border border-brand-border rounded-xl font-semibold hover:bg-brand-blush"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
