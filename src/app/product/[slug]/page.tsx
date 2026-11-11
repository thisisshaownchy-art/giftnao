'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Minus, 
  Plus, 
  Info,
  Gift,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, ProductVariant } from '../../../lib/types';
import { StoreService } from '../../../lib/storeService';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { ProductCard } from '../../../components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [personalizationText, setPersonalizationText] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      StoreService.getProductBySlug(slug).then((prod) => {
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.images[0] || '');
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          }
          // fetch related
          StoreService.getProductsByCategory(prod.categorySlug).then((list) => {
            setRelatedProducts(list.filter((p) => p.id !== prod.id).slice(0, 4));
          });
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-white rounded-3xl border border-brand-border" />
          <div className="space-y-4">
            <div className="h-8 bg-white rounded w-3/4" />
            <div className="h-6 bg-white rounded w-1/4" />
            <div className="h-24 bg-white rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Gift Not Found</h1>
        <p className="text-xs text-brand-dark/70 mt-2">
          The requested gift product may have been archived or moved.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block px-5 py-2.5 bg-brand-burgundy text-white rounded-xl text-xs font-semibold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);

  const handleAddToCart = (isBuyNow = false) => {
    addToCart(product, quantity, selectedVariant, personalizationText, giftMessage);
    if (isBuyNow) {
      router.push('/checkout');
    } else {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-brand-dark/60">
        <Link href="/" className="hover:text-brand-burgundy">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-burgundy">Shop</Link>
        <span>/</span>
        <Link href={`/category/${product.categorySlug}`} className="hover:text-brand-burgundy">{product.category}</Link>
        <span>/</span>
        <span className="text-brand-burgundy font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-brand-blush/30 border border-brand-border shadow-sm relative">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isBestseller && (
              <span className="absolute top-4 left-4 bg-brand-burgundy text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Bestseller
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                    selectedImage === img ? 'border-brand-burgundy' : 'border-brand-border/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-wider block mb-1">
              {product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-brand-dark/60 mt-1 italic">
              {product.shortDescription}
            </p>
          </div>

          {/* Price & Stock */}
          <div className="p-4 rounded-2xl bg-white border border-brand-border/80 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-burgundy">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-brand-dark/40 line-through">
                    ৳{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-dark/60 mt-0.5">
                Inclusive of all taxes. Nationwide shipping available.
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  product.stockQuantity > 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed space-y-3">
            <p>{product.description}</p>
          </div>

          {/* Personalization Fields */}
          {product.isPersonalizable && (
            <div className="p-4 rounded-2xl bg-brand-blush/40 border border-brand-border space-y-3">
              <div className="flex items-center gap-2 text-brand-burgundy text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Personalization Included</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                  Recipient Name or Engraving Text:
                </label>
                <input
                  type="text"
                  placeholder="e.g. For Ayesha, With Love Always"
                  value={personalizationText}
                  onChange={(e) => setPersonalizationText(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                  Handwritten Card Message (Optional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Write a sweet note to be calligraphed on our signature parchment card..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-brand-dark">Quantity:</span>
              <div className="flex items-center border border-brand-border rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-brand-dark hover:bg-brand-blush disabled:opacity-40 rounded-l-xl transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                  className="p-2 text-brand-dark hover:bg-brand-blush disabled:opacity-40 rounded-r-xl transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={product.stockQuantity <= 0}
                className="w-full py-3.5 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={product.stockQuantity <= 0}
                className="w-full py-3.5 rounded-xl bg-brand-dark hover:bg-black text-white text-xs font-semibold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Gift className="w-4 h-4" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-full py-2.5 rounded-xl border border-brand-border text-xs font-medium flex items-center justify-center gap-2 transition ${
                wishlisted ? 'bg-brand-blush text-brand-burgundy font-semibold' : 'bg-white hover:bg-brand-blush text-brand-dark'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-brand-burgundy text-brand-burgundy' : ''}`} />
              <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Successfully added to your shopping bag!</span>
              </div>
            )}
          </div>

          {/* Delivery & Trust Details */}
          <div className="border-t border-brand-border/60 pt-4 space-y-2.5 text-xs text-brand-dark/70">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-brand-burgundy" />
              <span><strong>Inside Dhaka:</strong> 24–48 hours (৳70) • <strong>Outside Dhaka:</strong> 2–4 days (৳130)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-burgundy" />
              <span>Cash on Delivery & Secure Mobile Banking (bKash, Nagad, Rocket)</span>
            </div>
          </div>

          {/* Food Details if chocolate / sweets */}
          {(product.ingredients || product.allergens || product.weight || product.expiryInfo) && (
            <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-brand-dark">
                <Info className="w-3.5 h-3.5 text-brand-burgundy" />
                <span>Product Specifications & Allergen Notice</span>
              </div>
              {product.weight && <p><span className="font-semibold">Net Weight:</span> {product.weight}</p>}
              {product.ingredients && <p><span className="font-semibold">Ingredients:</span> {product.ingredients}</p>}
              {product.allergens && <p className="text-rose-700"><span className="font-semibold">Allergens:</span> {product.allergens}</p>}
              {product.expiryInfo && <p><span className="font-semibold">Shelf Life:</span> {product.expiryInfo}</p>}
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-brand-border/60 pt-12">
          <div className="mb-6">
            <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
              You Might Also Love
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mt-1">
              Related Romantic Hampers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
