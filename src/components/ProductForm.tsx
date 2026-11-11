'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Info,
  Sparkles,
  Layers,
  DollarSign,
  Package,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Product, ProductStatus } from '../lib/types';
import { StoreService } from '../lib/storeService';
import { OCCASIONS_LIST } from '../lib/sampleData';

interface ProductFormProps {
  initialProduct?: Product | null;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, isEdit = false }) => {
  const router = useRouter();

  // Active form section tab
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'images' | 'inventory' | 'options' | 'publish'>('basic');

  // Form state
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [categorySlug, setCategorySlug] = useState(initialProduct?.categorySlug || 'couple-gifts');
  const [categoryName, setCategoryName] = useState(initialProduct?.category || 'Couple Gifts');
  const [occasions, setOccasions] = useState<string[]>(initialProduct?.occasions || ['Couple Gifts']);

  // Pricing
  const [price, setPrice] = useState<number | string>(initialProduct?.price ?? 1500);
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>(initialProduct?.compareAtPrice ?? '');
  const [costPrice, setCostPrice] = useState<number | string>(initialProduct?.costPrice ?? '');

  // Images
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Inventory
  const [stockQuantity, setStockQuantity] = useState<number | string>(initialProduct?.stockQuantity ?? 15);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | string>(initialProduct?.lowStockThreshold ?? 5);
  const [trackStock, setTrackStock] = useState<boolean>(initialProduct?.trackStock !== false);

  // Options & Compliance
  const [isPersonalizable, setIsPersonalizable] = useState<boolean>(Boolean(initialProduct?.isPersonalizable));
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || '');
  const [weight, setWeight] = useState(initialProduct?.weight || '');
  const [ingredients, setIngredients] = useState(initialProduct?.ingredients || '');
  const [allergens, setAllergens] = useState(initialProduct?.allergens || '');
  const [expiryInfo, setExpiryInfo] = useState(initialProduct?.expiryInfo || '');

  // Publication
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || 'published');
  const [isFeatured, setIsFeatured] = useState<boolean>(Boolean(initialProduct?.isFeatured));
  const [isBestseller, setIsBestseller] = useState<boolean>(Boolean(initialProduct?.isBestseller));

  // Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-generate slug and SKU if creating new
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && (!slug || slug === initialProduct?.slug)) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (!sku) {
        setSku(`GN-${generatedSlug.slice(0, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
      }
    }
  };

  // Upload handler for files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await StoreService.uploadProductImage(files[i]);
        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.url) {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setImages(reordered);
  };

  // Save Product Handler
  const handleSave = async (forcedStatus?: ProductStatus) => {
    setErrorMessage('');
    if (!name.trim()) {
      setActiveTab('basic');
      setErrorMessage('Please enter a product name.');
      return;
    }

    if (Number(price) < 0) {
      setActiveTab('pricing');
      setErrorMessage('Selling price cannot be negative.');
      return;
    }

    if (Number(stockQuantity) < 0) {
      setActiveTab('inventory');
      setErrorMessage('Stock quantity cannot be negative.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalStatus = forcedStatus || status;
      const saved = await StoreService.saveProduct({
        id: initialProduct?.id,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: sku.trim() || `GN-${Math.floor(1000 + Math.random() * 9000)}`,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        category: categoryName,
        categorySlug,
        occasions,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'],
        stockQuantity: Number(stockQuantity),
        lowStockThreshold: Number(lowStockThreshold),
        trackStock,
        status: finalStatus,
        isAvailable: finalStatus === 'published' && Number(stockQuantity) > 0,
        isPersonalizable,
        isFeatured,
        isBestseller,
        dimensions,
        weight,
        ingredients,
        allergens,
        expiryInfo,
      });

      setSuccessNotice(`Product "${saved.name}" successfully saved!`);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-brand-burgundy hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            {isEdit ? `Edit: ${initialProduct?.name}` : 'Add New Romantic Hamper'}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {slug && (
            <Link
              href={`/product/${slug}`}
              target="_blank"
              className="px-3.5 py-2 bg-white border border-brand-border hover:bg-brand-blush text-brand-dark rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4 text-brand-burgundy" />
              <span>Preview</span>
            </Link>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave('draft')}
            className="px-4 py-2 border border-brand-border bg-white hover:bg-brand-blush text-brand-dark rounded-xl text-xs font-semibold transition shadow-xs"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave('published')}
            className="px-5 py-2 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-border overflow-x-auto text-xs font-semibold space-x-2">
        {[
          { key: 'basic', label: '1. Basic Info', icon: FileText },
          { key: 'pricing', label: '2. Pricing (BDT)', icon: DollarSign },
          { key: 'images', label: '3. Images & Media', icon: ImageIcon },
          { key: 'inventory', label: '4. Inventory & Stock', icon: Package },
          { key: 'options', label: '5. Options & Specs', icon: Layers },
          { key: 'publish', label: '6. Status & Badges', icon: Sparkles },
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

      {/* Form Content Sections */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs text-xs space-y-6">
        
        {/* TAB 1: BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border/60 pb-2">
              Product Identification & Descriptions
            </h2>

            <div>
              <label className="block font-semibold text-brand-dark mb-1">
                Product Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Romantic Couple Keepsake Hamper"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-cream/20 text-sm focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  URL Slug (Auto-generated / Editable)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-brand-cream/60 border border-r-0 border-brand-border rounded-l-xl text-brand-dark/50 font-mono text-[11px]">
                    /product/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-r-xl border border-brand-border bg-white font-mono focus:outline-none focus:border-brand-burgundy"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Product SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GN-COUPLE-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white font-mono uppercase focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-brand-dark mb-1">
                Short Tagline / Teaser Description
              </label>
              <input
                type="text"
                placeholder="A sweet, one-sentence description displayed on cards and search..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-dark mb-1">
                Full Detailed Description
              </label>
              <textarea
                rows={5}
                placeholder="Detailed hamper contents, keepsake memories, craftsmanship, and romantic touches..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Primary Category
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => {
                    const selected = OCCASIONS_LIST.find((o) => o.slug === e.target.value);
                    setCategorySlug(e.target.value);
                    setCategoryName(selected ? selected.name : 'Romantic Gifts');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white font-medium"
                >
                  {OCCASIONS_LIST.map((occ) => (
                    <option key={occ.slug} value={occ.slug}>
                      {occ.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Occasion Tags
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {OCCASIONS_LIST.map((occ) => {
                    const isSelected = occasions.includes(occ.name);
                    return (
                      <button
                        key={occ.slug}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setOccasions(occasions.filter((o) => o !== occ.name));
                          } else {
                            setOccasions([...occasions, occ.name]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-brand-burgundy text-white'
                            : 'bg-brand-blush/60 text-brand-dark hover:bg-brand-blush'
                        }`}
                      >
                        {occ.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRICING */}
        {activeTab === 'pricing' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border/60 pb-2">
              Pricing in Bangladeshi Taka (৳ BDT)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Customer Selling Price (৳) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-brand-burgundy">৳</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-brand-border bg-white font-mono font-bold text-sm focus:outline-none focus:border-brand-burgundy"
                  />
                </div>
                <p className="text-[10px] text-brand-dark/50 mt-1">Price charged to customer</p>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Compare-At Price (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-brand-dark/40">৳</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2800"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-brand-border bg-white font-mono text-sm focus:outline-none focus:border-brand-burgundy"
                  />
                </div>
                <p className="text-[10px] text-brand-dark/50 mt-1">Original price (shows discount strike)</p>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Cost Price (৳) — Internal Only
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-brand-dark/40">৳</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1100"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-brand-border bg-white font-mono text-sm focus:outline-none focus:border-brand-burgundy"
                  />
                </div>
                <p className="text-[10px] text-brand-dark/50 mt-1">For gross margin auditing (hidden from public)</p>
              </div>
            </div>

            {/* Profit margin calculation */}
            {Number(price) > 0 && Number(costPrice) > 0 && (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-800">Gross Margin Estimation:</span>
                  <p className="text-[11px] text-emerald-700">
                    Profit: ৳{(Number(price) - Number(costPrice)).toLocaleString()} per unit
                  </p>
                </div>
                <span className="font-serif text-lg font-bold text-emerald-800">
                  {Math.round(((Number(price) - Number(costPrice)) / Number(price)) * 100)}% Margin
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IMAGES & GALLERY */}
        {activeTab === 'images' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
              <div>
                <h2 className="font-serif text-base font-bold text-brand-dark">
                  Product Photography & Gallery
                </h2>
                <p className="text-xs text-brand-dark/60">
                  Upload to Supabase Storage or link high-resolution image URLs.
                </p>
              </div>
              <span className="text-xs font-semibold text-brand-burgundy">
                {images.length} Image{images.length !== 1 ? 's' : ''} Added
              </span>
            </div>

            {/* File Upload Box */}
            <div className="p-6 border-2 border-dashed border-brand-border rounded-3xl bg-brand-cream/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <label className="cursor-pointer px-4 py-2 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white rounded-xl font-semibold shadow-xs transition inline-block">
                  <span>Browse Image Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-brand-dark/50 mt-1">
                  Supports JPG, PNG, WebP (Max 5MB each)
                </p>
              </div>

              {isUploading && (
                <div className="text-xs text-brand-burgundy font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                  <span>Uploading to Supabase Storage...</span>
                </div>
              )}
            </div>

            {/* Manual Image URL Adder */}
            <form onSubmit={handleAddImageUrl} className="flex gap-2">
              <input
                type="url"
                placeholder="Or paste an image URL (e.g. Unsplash, Cloudinary)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-brand-border bg-white text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-brand-border bg-brand-cream/40 hover:bg-brand-blush font-semibold rounded-xl text-brand-dark"
              >
                Add URL
              </button>
            </form>

            {/* Gallery Grid & Reordering */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-2xl overflow-hidden border border-brand-border bg-brand-blush/20 aspect-square shadow-xs"
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-burgundy text-white text-[10px] font-bold rounded-md">
                        Primary Cover
                      </span>
                    )}

                    {/* Image Controls Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'up')}
                          className="p-1.5 bg-white/90 rounded text-brand-dark hover:bg-white text-[11px] font-bold"
                          title="Move Left/Earlier"
                        >
                          &larr;
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 bg-rose-600 text-white rounded hover:bg-rose-700"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'down')}
                          className="p-1.5 bg-white/90 rounded text-brand-dark hover:bg-white text-[11px] font-bold"
                          title="Move Right/Later"
                        >
                          &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border/60 pb-2">
              Inventory & Real-Time Stock Limits
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Current Available Stock <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white font-mono text-sm font-bold focus:outline-none focus:border-brand-burgundy"
                />
                <p className="text-[10px] text-brand-dark/50 mt-1">
                  Automatically deducted upon customer orders. Prevented from going negative.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white font-mono text-sm focus:outline-none focus:border-brand-burgundy"
                />
                <p className="text-[10px] text-brand-dark/50 mt-1">
                  Triggers low-stock warning card on the admin dashboard.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-brand-cream/30 rounded-xl border border-brand-border">
                <input
                  type="checkbox"
                  checked={trackStock}
                  onChange={(e) => setTrackStock(e.target.checked)}
                  className="accent-brand-burgundy rounded"
                />
                <div>
                  <span className="font-bold text-brand-dark block">Track Inventory for this Product</span>
                  <span className="text-[10px] text-brand-dark/60">
                    Disallows orders if stock drops to zero. Recommended for limited edition hampers.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* TAB 5: OPTIONS & SPECS */}
        {activeTab === 'options' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border/60 pb-2">
              Personalization, Dimensions & Food Compliance
            </h2>

            {/* Personalization toggle */}
            <div className="p-4 bg-brand-blush/30 rounded-2xl border border-brand-border">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPersonalizable}
                  onChange={(e) => setIsPersonalizable(e.target.checked)}
                  className="accent-brand-burgundy rounded"
                />
                <div>
                  <span className="font-bold text-brand-burgundy block">
                    Allow Customer Personalization & Handwritten Love Letters
                  </span>
                  <span className="text-[10px] text-brand-dark/70">
                    Shows recipient name engraving and custom calligraphy card text fields on product page.
                  </span>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Product Dimensions (e.g. 20cm x 15cm x 10cm)
                </label>
                <input
                  type="text"
                  placeholder="20cm x 15cm x 10cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Total Weight (e.g. 650g)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500g"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Ingredients (For Chocolates & Sweets)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Milk chocolate, cocoa butter, hazelnuts..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Allergen Warning Notice
                </label>
                <input
                  type="text"
                  placeholder="e.g. Contains dairy and tree nuts."
                  value={allergens}
                  onChange={(e) => setAllergens(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-brand-dark mb-1">
                  Expiry & Shelf Life Information
                </label>
                <input
                  type="text"
                  placeholder="e.g. Best before 6 months from packaging date."
                  value={expiryInfo}
                  onChange={(e) => setExpiryInfo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PUBLICATION & BADGES */}
        {activeTab === 'publish' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-serif text-base font-bold text-brand-dark border-b border-brand-border/60 pb-2">
              Publication Status & Promotional Highlights
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white font-medium"
                >
                  <option value="published">Published (Visible in Shop)</option>
                  <option value="draft">Draft (Hidden from Customers)</option>
                  <option value="archived">Archived (Retired)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-brand-cream/30 rounded-xl border border-brand-border">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-brand-burgundy rounded"
                />
                <div>
                  <span className="font-bold text-brand-dark block">Featured on Homepage</span>
                  <span className="text-[10px] text-brand-dark/60">
                    Displays in the curated gift highlights on the front page.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-brand-cream/30 rounded-xl border border-brand-border">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="accent-brand-burgundy rounded"
                />
                <div>
                  <span className="font-bold text-brand-dark block">Bestseller Badge</span>
                  <span className="text-[10px] text-brand-dark/60">
                    Affixes the burgundy "Bestseller" ribbon to the product card.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
