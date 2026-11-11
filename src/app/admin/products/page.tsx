'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  CheckCircle2, 
  Search, 
  Filter, 
  Archive, 
  ArrowUpDown,
  MoreVertical,
  Check,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { StoreService } from '../../../lib/storeService';
import { Product, ProductStatus } from '../../../lib/types';
import { OCCASIONS_LIST } from '../../../lib/sampleData';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Confirm dialog state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadProducts = () => {
    setLoading(true);
    StoreService.getProducts(true).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // Actions
  const handleDuplicate = async (id: string) => {
    try {
      const dup = await StoreService.duplicateProduct(id);
      showNotification(`Duplicated "${dup.name}" as draft with SKU: ${dup.sku}`);
      loadProducts();
    } catch (e: any) {
      showNotification(`Failed to duplicate: ${e.message}`);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus?: ProductStatus) => {
    const isCurrentlyPublished = currentStatus === 'published';
    await StoreService.publishProduct(id, !isCurrentlyPublished);
    showNotification(`Product marked as ${!isCurrentlyPublished ? 'Published' : 'Draft'}`);
    loadProducts();
  };

  const handleArchive = async (id: string) => {
    await StoreService.archiveProduct(id);
    showNotification('Product archived safely.');
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    await StoreService.deleteProduct(id);
    showNotification('Product removed from active catalog.');
    setDeleteConfirmId(null);
    loadProducts();
  };

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.categorySlug === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || (p.status || (p.isAvailable ? 'published' : 'draft')) === selectedStatus;

    let matchesStock = true;
    if (selectedStock === 'in_stock') matchesStock = p.stockQuantity > (p.lowStockThreshold || 5);
    if (selectedStock === 'low_stock') matchesStock = p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5);
    if (selectedStock === 'out_of_stock') matchesStock = p.stockQuantity <= 0;

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            Product Catalog Management
          </h1>
          <p className="text-xs text-brand-dark/60 mt-1">
            Manage romantic hampers, SKUs, pricing, stock levels, and publication states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search by name, SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-brand-cream/30 px-3.5 py-2 pl-9 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy"
            />
            <Search className="w-4 h-4 text-brand-dark/40 absolute left-3 top-2.5" />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-brand-cream/30 border border-brand-border rounded-xl px-3 py-2 font-medium"
            >
              <option value="all">All Categories</option>
              {OCCASIONS_LIST.map((occ) => (
                <option key={occ.slug} value={occ.slug}>
                  {occ.name}
                </option>
              ))}
            </select>
          </div>

          {/* Publication Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-brand-cream/30 border border-brand-border rounded-xl px-3 py-2 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Stock Availability */}
          <div>
            <select
              value={selectedStock}
              onChange={(e) => {
                setSelectedStock(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-brand-cream/30 border border-brand-border rounded-xl px-3 py-2 font-medium"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt; 5)</option>
              <option value="low_stock">Low Stock (1–5)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Filter Count & Reset */}
        <div className="flex items-center justify-between text-[11px] text-brand-dark/60 pt-2 border-t border-brand-border/60">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedStock !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedStock('all');
                setCurrentPage(1);
              }}
              className="text-brand-burgundy font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-xs text-brand-dark/60 space-y-2">
            <div className="w-8 h-8 mx-auto border-3 border-brand-burgundy border-t-transparent rounded-full animate-spin" />
            <p>Loading catalog products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
              <ShoppingBag className="w-7 h-7 opacity-60" />
            </div>
            <h3 className="font-serif text-base font-bold text-brand-dark">No products found</h3>
            <p className="text-xs text-brand-dark/60 max-w-sm mx-auto">
              No products match your filter parameters. Try clearing your search or add a new gift hamper.
            </p>
            <Link
              href="/admin/products/new"
              className="inline-block px-4 py-2 bg-brand-burgundy text-white rounded-xl text-xs font-semibold"
            >
              Add New Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-cream/60 border-b border-brand-border text-brand-dark/70">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price (BDT)</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {paginatedProducts.map((p) => {
                  const status = p.status || (p.isAvailable ? 'published' : 'draft');
                  const isLow = p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5);
                  const isOut = p.stockQuantity <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-brand-blush/20 transition">
                      {/* Thumbnail & Name */}
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-brand-blush border border-brand-border flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-serif font-bold text-brand-dark truncate max-w-xs">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.isFeatured && (
                              <span className="text-[10px] text-brand-burgundy font-bold bg-brand-blush px-1.5 py-0.2 rounded">
                                Featured
                              </span>
                            )}
                            {p.isBestseller && (
                              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                                Bestseller
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono font-medium text-brand-dark/80">
                        {p.sku || 'N/A'}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-brand-dark">{p.category}</span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-brand-burgundy text-sm">
                          ৳{p.price.toLocaleString()}
                        </div>
                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                          <div className="text-[10px] text-brand-dark/40 line-through">
                            ৳{p.compareAtPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {p.stockQuantity} units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : status === 'draft'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Preview Product */}
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-brand-dark/60 hover:text-brand-burgundy hover:bg-brand-blush rounded-lg transition"
                            title="Preview customer product page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Quick Publish / Unpublish */}
                          <button
                            onClick={() => handleTogglePublish(p.id, p.status)}
                            className={`p-1.5 rounded-lg transition ${
                              status === 'published'
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-zinc-500 hover:bg-zinc-100'
                            }`}
                            title={status === 'published' ? 'Unpublish (set to draft)' : 'Publish product'}
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          {/* Edit Product */}
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-brand-dark/70 hover:text-brand-burgundy hover:bg-brand-blush rounded-lg transition"
                            title="Edit Product Details"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Duplicate Product */}
                          <button
                            onClick={() => handleDuplicate(p.id)}
                            className="p-1.5 text-brand-dark/70 hover:text-brand-burgundy hover:bg-brand-blush rounded-lg transition"
                            title="Duplicate as new draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Archive Product */}
                          <button
                            onClick={() => handleArchive(p.id)}
                            className="p-1.5 text-brand-dark/70 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                            title="Archive product"
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          {/* Delete Confirmation Trigger */}
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-brand-dark/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete or Archive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs">
            <span className="text-brand-dark/60">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 border border-brand-border rounded-xl disabled:opacity-40 hover:bg-brand-blush transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 border border-brand-border rounded-xl disabled:opacity-40 hover:bg-brand-blush transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete / Archive Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-border p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-brand-dark">Confirm Product Removal</h3>
              <p className="text-xs text-brand-dark/70 leading-relaxed">
                If this product has existing customer orders, it will be safely <strong>Archived</strong> so order history remains intact. Are you sure you want to proceed?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 border border-brand-border rounded-xl text-xs font-semibold text-brand-dark hover:bg-brand-blush"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
