'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X, 
  ExternalLink,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { StoreService } from '../../../lib/storeService';
import { CategoryItem } from '../../../lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [notice, setNotice] = useState('');

  const loadData = () => {
    setLoading(true);
    StoreService.getCategories().then((res) => {
      setCategories(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const catItem: CategoryItem = {
      id: editingCategory.id || `cat_${slug}`,
      slug,
      name: editingCategory.name,
      description: editingCategory.description || '',
      isActive: editingCategory.isActive !== false,
      sortOrder: editingCategory.sortOrder || categories.length,
    };

    await StoreService.saveCategory(catItem);
    setNotice(`Category "${catItem.name}" saved!`);
    setEditingCategory(null);
    loadData();
    setTimeout(() => setNotice(''), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the category "${name}"? Existing products with this category will retain their information.`)) {
      await StoreService.deleteCategory(id);
      setNotice(`Category "${name}" removed.`);
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
            Categories & Occasions
          </h1>
          <p className="text-xs text-brand-dark/60 mt-1">
            Manage romantic occasions and gifting taxonomy reflected across the store navigation.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingCategory({
              name: '',
              slug: '',
              description: '',
              isActive: true,
            })
          }
          className="px-4 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id || cat.slug}
            className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex items-start justify-between gap-4 group hover:border-brand-burgundy/40 transition"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-bold text-brand-dark truncate">{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="font-mono text-[11px] text-brand-burgundy truncate">
                /category/{cat.slug}
              </p>
              <p className="text-xs text-brand-dark/70 line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Link
                href={`/category/${cat.slug}`}
                target="_blank"
                className="p-1.5 text-brand-dark/60 hover:text-brand-burgundy hover:bg-brand-blush rounded-lg transition"
                title="View customer category page"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setEditingCategory(cat)}
                className="p-1.5 text-brand-dark/60 hover:text-brand-burgundy hover:bg-brand-blush rounded-lg transition"
                title="Edit category"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id || cat.slug, cat.name)}
                className="p-1.5 text-brand-dark/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setEditingCategory(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-border p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-serif text-lg font-bold text-brand-dark">
                {editingCategory.id ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-brand-dark/50 hover:bg-brand-blush rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Category Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengali New Year Gifts"
                  value={editingCategory.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setEditingCategory({
                      ...editingCategory,
                      name: val,
                      slug: editingCategory.slug ? editingCategory.slug : autoSlug,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-2.5 py-2 bg-brand-cream/60 border border-r-0 border-brand-border rounded-l-xl text-brand-dark/50 font-mono text-[10px]">
                    /category/
                  </span>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-r-xl border border-brand-border bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Tagline / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short romantic summary for this occasion..."
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive !== false}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                    className="accent-brand-burgundy rounded"
                  />
                  <span className="font-semibold text-brand-dark">Active on customer navigation</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-brand-border rounded-xl font-semibold hover:bg-brand-blush"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
