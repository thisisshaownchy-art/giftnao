'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShoppingBag, 
  Settings, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Truck,
  Plus,
  AlertCircle,
  Eye,
  RefreshCw,
  Calendar,
  Smartphone
} from 'lucide-react';
import { StoreService } from '../../lib/storeService';
import { Order, Product } from '../../lib/types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([StoreService.getAdminMetrics(), StoreService.getAllOrders()]).then(
      ([m, orders]) => {
        setMetrics(m);
        setRecentOrders(orders.slice(0, 6));
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blush text-brand-burgundy text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Store Operations Live Console</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            GiftNao Executive Overview
          </h1>
          <p className="text-xs text-brand-dark/60 mt-1">
            Real-time orders, payment audits, and catalog performance metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 bg-white border border-brand-border rounded-xl text-brand-dark hover:bg-brand-blush transition shadow-xs"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-burgundy' : ''}`} />
          </button>

          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>

          <Link
            href="/admin/orders?status=pending_confirmation"
            className="px-4 py-2.5 bg-white border border-brand-border hover:bg-brand-blush text-brand-burgundy rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <Clock className="w-4 h-4 text-brand-burgundy" />
            <span>Pending Orders ({metrics?.pendingOrders || 0})</span>
          </Link>
        </div>
      </div>

      {/* Sales Velocity (Today, 7 Days, 30 Days) */}
      <div className="bg-gradient-to-r from-brand-burgundy via-brand-burgundy-light to-brand-burgundy rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-rose" />
            <h2 className="font-serif text-lg font-bold">Verified Sales Revenue</h2>
          </div>
          <span className="text-[11px] text-brand-rose bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
            Strict Rule: Only Paid & Collected Orders Counted
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          <div>
            <span className="text-xs text-brand-rose block">Sales Today</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold mt-1">
              ৳{(metrics?.salesToday || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-brand-rose/80">Since 12:00 AM</span>
          </div>

          <div>
            <span className="text-xs text-brand-rose block">Last 7 Days</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold mt-1">
              ৳{(metrics?.salesLast7Days || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-brand-rose/80">Rolling 7-day volume</span>
          </div>

          <div>
            <span className="text-xs text-brand-rose block">Last 30 Days</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold mt-1">
              ৳{(metrics?.salesLast30Days || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-brand-rose/80">Monthly verified run-rate</span>
          </div>

          <div>
            <span className="text-xs text-brand-rose block">All-Time Revenue</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold mt-1">
              ৳{(metrics?.totalSales || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-brand-rose/80">Lifetime realized sales</span>
          </div>
        </div>
      </div>

      {/* Operational Order & Stock KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-brand-dark/60 block">Total Orders</span>
          <p className="font-serif text-2xl font-bold text-brand-dark">{metrics?.totalOrders || 0}</p>
          <span className="text-[10px] text-brand-dark/50">All customer submissions</span>
        </div>

        {/* Pending Confirmation */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 bg-amber-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-amber-800 block">Needs Confirmation</span>
          <p className="font-serif text-2xl font-bold text-amber-600">{metrics?.pendingOrders || 0}</p>
          <span className="text-[10px] text-amber-700/80">Awaiting artisan review</span>
        </div>

        {/* Processing & In-Flight */}
        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-blue-700 block">In Packaging / Transit</span>
          <p className="font-serif text-2xl font-bold text-blue-600">{metrics?.processingOrders || 0}</p>
          <span className="text-[10px] text-brand-dark/50">Processing or dispatched</span>
        </div>

        {/* Payments Awaiting Verification */}
        <div className="p-5 rounded-2xl bg-white border border-pink-200 bg-pink-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-pink-800 block">Verify Payments</span>
          <p className="font-serif text-2xl font-bold text-pink-600">{metrics?.awaitingPayments || 0}</p>
          <span className="text-[10px] text-pink-700/80">bKash / Nagad / Rocket</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-orange-700 block">Low Stock (&le; 10)</span>
          <p className="font-serif text-2xl font-bold text-orange-600">{metrics?.lowStockCount || 0}</p>
          <span className="text-[10px] text-brand-dark/50">Re-order required soon</span>
        </div>

        {/* Out of Stock */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 bg-rose-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-rose-800 block">Out of Stock (0)</span>
          <p className="font-serif text-2xl font-bold text-rose-600">{metrics?.outOfStockCount || 0}</p>
          <span className="text-[10px] text-rose-700/80">Unavailable on storefront</span>
        </div>
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/products/new"
          className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-burgundy/60 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-blush flex items-center justify-center text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xs font-bold text-brand-dark group-hover:text-brand-burgundy transition">
              Add New Product
            </h3>
            <p className="text-[10px] text-brand-dark/60">Upload hampers & gifts</p>
          </div>
        </Link>

        <Link
          href="/admin/inventory"
          className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-burgundy/60 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-blush flex items-center justify-center text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xs font-bold text-brand-dark group-hover:text-brand-burgundy transition">
              Stock Management
            </h3>
            <p className="text-[10px] text-brand-dark/60">Manual adjustments & logs</p>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-burgundy/60 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-blush flex items-center justify-center text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xs font-bold text-brand-dark group-hover:text-brand-burgundy transition">
              Courier & Shipping
            </h3>
            <p className="text-[10px] text-brand-dark/60">Steadfast / Pathao tracking</p>
          </div>
        </Link>

        <Link
          href="/admin/coupons"
          className="p-4 rounded-2xl bg-white border border-brand-border hover:border-brand-burgundy/60 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-blush flex items-center justify-center text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xs font-bold text-brand-dark group-hover:text-brand-burgundy transition">
              Coupons & Promos
            </h3>
            <p className="text-[10px] text-brand-dark/60">Discount codes & limits</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-dark">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-brand-dark/60">Live orders placed across Bangladesh</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-brand-burgundy hover:underline flex items-center gap-1"
          >
            <span>View All Orders &rarr;</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
              <Package className="w-7 h-7 opacity-60" />
            </div>
            <h3 className="font-serif text-base font-bold text-brand-dark">No orders logged yet</h3>
            <p className="text-xs text-brand-dark/60 max-w-sm mx-auto">
              When customers complete checkout, orders will appear here for verification and fulfillment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-cream/60 border-b border-brand-border text-brand-dark/70">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order Ref</th>
                  <th className="py-3 px-4 font-semibold">Customer / Recipient</th>
                  <th className="py-3 px-4 font-semibold">District & Area</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Order Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-brand-blush/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-burgundy">
                      {o.orderNumber}
                      <span className="block text-[10px] text-brand-dark/50 font-sans">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-brand-dark">{o.customerName}</p>
                      <p className="text-[11px] text-brand-dark/60">📞 {o.customerPhone}</p>
                      {o.isSurpriseGift && (
                        <span className="text-[10px] text-brand-burgundy font-bold">🎁 Surprise</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-brand-dark">{o.district}</p>
                      <p className="text-[11px] text-brand-dark/60">{o.area}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold uppercase text-brand-dark">{o.paymentMethod}</span>
                      <div className="mt-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.paymentStatus === 'awaiting_verification'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-brand-blush text-brand-burgundy'
                          }`}
                        >
                          {o.paymentStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {o.transactionId && (
                        <span className="text-[10px] font-mono text-brand-dark/70 block mt-0.5">
                          Trx: {o.transactionId}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-brand-dark text-sm">
                      ৳{o.finalTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-blush text-brand-burgundy">
                        {o.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders?highlight=${o.orderNumber}`}
                        className="px-3 py-1.5 bg-brand-burgundy text-white rounded-lg text-[11px] font-semibold hover:bg-brand-burgundy-hover transition shadow-xs"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
