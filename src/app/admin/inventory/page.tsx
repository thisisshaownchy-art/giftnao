'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpDown, 
  History, 
  Plus, 
  Minus, 
  Save, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StoreService } from '../../../lib/storeService';
import { Product, InventoryLog } from '../../../lib/types';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Adjustment modal state
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'set' | 'add' | 'subtract'>('add');
  const [amount, setAmount] = useState<number>(5);
  const [reason, setReason] = useState<InventoryLog['reason']>('restock');
  const [notes, setNotes] = useState('');
  const [adminName, setAdminName] = useState('Administrator');
  const [notice, setNotice] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([StoreService.getProducts(true), StoreService.getInventoryLogs()]).then(
      ([prods, invLogs]) => {
        setProducts(prods);
        setLogs(invLogs);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    let targetStock = adjustingProduct.stockQuantity;
    if (adjustmentType === 'set') {
      targetStock = Number(amount);
    } else if (adjustmentType === 'add') {
      targetStock += Number(amount);
    } else if (adjustmentType === 'subtract') {
      targetStock = Math.max(0, targetStock - Number(amount));
    }

    await StoreService.adjustStock(
      adjustingProduct.id,
      targetStock,
      reason,
      notes || `Stock adjusted via Admin Console`,
      adminName
    );

    setNotice(`Stock for "${adjustingProduct.name}" updated to ${targetStock} units.`);
    setAdjustingProduct(null);
    setAmount(5);
    setNotes('');
    loadData();
    setTimeout(() => setNotice(''), 4000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const isLow = p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5);
    const isOut = p.stockQuantity <= 0;

    if (stockFilter === 'low') return matchesSearch && isLow;
    if (stockFilter === 'out') return matchesSearch && isOut;
    return matchesSearch;
  });

  const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5)).length;
  const outOfStockCount = products.filter(p => p.stockQuantity <= 0).length;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            Inventory & Stock Auditing
          </h1>
          <p className="text-xs text-brand-dark/60 mt-1">
            Real-time stock reservation, deduction logging, and restock tracking.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 bg-white border border-brand-border rounded-xl text-brand-dark hover:bg-brand-blush transition shadow-xs flex items-center gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-burgundy' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Stock Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setStockFilter('all')}
          className={`p-5 rounded-2xl border text-left transition shadow-xs ${
            stockFilter === 'all'
              ? 'border-brand-burgundy bg-white ring-2 ring-brand-burgundy/20'
              : 'border-brand-border bg-white hover:bg-brand-blush/20'
          }`}
        >
          <span className="text-xs text-brand-dark/60 block font-medium">Total Tracked Products</span>
          <p className="font-serif text-2xl font-bold text-brand-dark mt-1">{products.length}</p>
          <span className="text-[10px] text-brand-dark/50">Full active catalog items</span>
        </button>

        <button
          onClick={() => setStockFilter('low')}
          className={`p-5 rounded-2xl border text-left transition shadow-xs ${
            stockFilter === 'low'
              ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
              : 'border-orange-200 bg-orange-50/20 hover:bg-orange-50/40'
          }`}
        >
          <span className="text-xs text-orange-800 block font-medium">Low Stock Warning</span>
          <p className="font-serif text-2xl font-bold text-orange-600 mt-1">{lowStockCount}</p>
          <span className="text-[10px] text-orange-700/80">At or below threshold (&le; 5 units)</span>
        </button>

        <button
          onClick={() => setStockFilter('out')}
          className={`p-5 rounded-2xl border text-left transition shadow-xs ${
            stockFilter === 'out'
              ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
              : 'border-rose-200 bg-rose-50/20 hover:bg-rose-50/40'
          }`}
        >
          <span className="text-xs text-rose-800 block font-medium">Out of Stock</span>
          <p className="font-serif text-2xl font-bold text-rose-600 mt-1">{outOfStockCount}</p>
          <span className="text-[10px] text-rose-700/80">Zero inventory remaining</span>
        </button>
      </div>

      {/* Product Stock Table */}
      <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-3 border-b border-brand-border text-xs">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-cream/30 px-3.5 py-2 pl-9 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy"
            />
            <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-2.5" />
          </div>

          <div className="text-[11px] text-brand-dark/60">
            Showing {filteredProducts.length} items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cream/60 border-b border-brand-border text-brand-dark/70">
              <tr>
                <th className="py-3 px-4 font-semibold">Hamper / Product</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold">Stock Status</th>
                <th className="py-3 px-4 font-semibold">Low Threshold</th>
                <th className="py-3 px-4 font-semibold text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {filteredProducts.map((p) => {
                const isOut = p.stockQuantity <= 0;
                const isLow = p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5);

                return (
                  <tr key={p.id} className="hover:bg-brand-blush/20 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-brand-blush flex-shrink-0"
                      />
                      <div>
                        <p className="font-serif font-bold text-brand-dark">{p.name}</p>
                        <p className="text-[10px] text-brand-dark/50">{p.category}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-brand-dark/80">
                      {p.sku || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-serif font-bold text-brand-dark text-sm">
                        {p.stockQuantity}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isOut
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-brand-dark/70 font-mono">
                      {p.lowStockThreshold || 5} units
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustingProduct(p);
                          setAdjustmentType('add');
                          setAmount(5);
                          setReason('restock');
                        }}
                        className="px-3 py-1.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold transition shadow-xs"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setAdjustingProduct(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-brand-border p-6 sm:p-8 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <span className="font-mono text-[10px] text-brand-burgundy font-bold">STOCK ADJUSTMENT</span>
                <h3 className="font-serif text-lg font-bold text-brand-dark">{adjustingProduct.name}</h3>
                <p className="text-[11px] text-brand-dark/60">Current Stock: <strong>{adjustingProduct.stockQuantity} units</strong></p>
              </div>
              <button onClick={() => setAdjustingProduct(null)} className="p-1 rounded-full text-brand-dark/50 hover:bg-brand-blush">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition ${
                      adjustmentType === 'add' ? 'bg-brand-burgundy text-white border-brand-burgundy' : 'bg-white border-brand-border hover:bg-brand-blush'
                    }`}
                  >
                    + Add Stock (Restock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('subtract')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition ${
                      adjustmentType === 'subtract' ? 'bg-brand-burgundy text-white border-brand-burgundy' : 'bg-white border-brand-border hover:bg-brand-blush'
                    }`}
                  >
                    - Deduct (Damage/Loss)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('set')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition ${
                      adjustmentType === 'set' ? 'bg-brand-burgundy text-white border-brand-burgundy' : 'bg-white border-brand-border hover:bg-brand-blush'
                    }`}
                  >
                    Set Exact Total
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Quantity Units:
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Reason for Audit Log <span className="text-rose-600">*</span></label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                >
                  <option value="restock">New Stock Arrival / Restock</option>
                  <option value="manual_adjustment">Manual Audit Count Correction</option>
                  <option value="damage">Damaged Goods / Expired Confectionery</option>
                  <option value="order_fulfillment">Manual Offline Sale</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">Internal Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Received shipment of 50 Belgian truffle boxes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 border border-brand-border rounded-xl font-semibold hover:bg-brand-blush"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Movement History Logs */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-burgundy" />
            <h2 className="font-serif text-lg font-bold text-brand-dark">
              Recent Inventory Audit Logs
            </h2>
          </div>
          <span className="text-xs text-brand-dark/50">Timestamped record</span>
        </div>

        {logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-dark/60">
            No stock movements recorded yet. As orders are placed or stock is adjusted, records will be archived here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-cream/60 border-b border-brand-border text-brand-dark/70">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Date & Time</th>
                  <th className="py-2.5 px-4 font-semibold">Product</th>
                  <th className="py-2.5 px-4 font-semibold">Prev Stock</th>
                  <th className="py-2.5 px-4 font-semibold">Adjustment</th>
                  <th className="py-2.5 px-4 font-semibold">New Stock</th>
                  <th className="py-2.5 px-4 font-semibold">Reason & Notes</th>
                  <th className="py-2.5 px-4 font-semibold">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {logs.slice(0, 15).map((log) => (
                  <tr key={log.id} className="hover:bg-brand-blush/20">
                    <td className="py-2.5 px-4 font-mono text-brand-dark/60">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-serif font-bold text-brand-dark">
                      {log.productName}
                    </td>
                    <td className="py-2.5 px-4 font-mono">
                      {log.previousStock}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold">
                      <span className={log.changeAmount >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold">
                      {log.newStock}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="capitalize font-semibold text-brand-dark">{log.reason.replace(/_/g, ' ')}</span>
                      {log.notes && <span className="block text-[10px] text-brand-dark/60 italic">{log.notes}</span>}
                    </td>
                    <td className="py-2.5 px-4 text-brand-dark/70">
                      {log.adminName || 'Admin'}
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
