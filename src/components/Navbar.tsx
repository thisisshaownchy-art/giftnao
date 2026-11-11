'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck 
} from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { OCCASIONS_LIST } from '../lib/sampleData';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [occasionsOpen, setOccasionsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brand-dark hover:text-brand-burgundy rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo height={44} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-brand-dark">
            <Link href="/" className="hover:text-brand-burgundy transition">
              Home
            </Link>
            <Link href="/shop" className="hover:text-brand-burgundy transition">
              Shop All
            </Link>
            <Link href="/category/couple-gifts" className="hover:text-brand-burgundy transition font-semibold text-brand-burgundy">
              Couple Gifts
            </Link>
            
            {/* Occasions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOccasionsOpen(true)}
              onMouseLeave={() => setOccasionsOpen(false)}
            >
              <button 
                className="flex items-center gap-1 hover:text-brand-burgundy py-2 transition"
                onClick={() => setOccasionsOpen(!occasionsOpen)}
              >
                <span>Occasions</span>
                <ChevronDown className="w-4 h-4 text-brand-rose" />
              </button>

              {occasionsOpen && (
                <div className="absolute left-0 top-full w-64 bg-white rounded-xl shadow-xl border border-brand-border p-2 py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-1 gap-1">
                    {OCCASIONS_LIST.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/category/${item.slug}`}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-brand-dark hover:bg-brand-blush hover:text-brand-burgundy transition flex items-center justify-between"
                        onClick={() => setOccasionsOpen(false)}
                      >
                        <span>{item.name}</span>
                        <span className="text-[10px] text-brand-rose font-normal">&rarr;</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/category/personalized-gifts" className="hover:text-brand-burgundy transition">
              Personalized Gifts
            </Link>
            <Link href="/contact" className="hover:text-brand-burgundy transition">
              Contact
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-1 max-w-xs relative items-center"
          >
            <input
              type="text"
              placeholder="Search gifts, chocolates, hampers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-blush/60 text-brand-dark text-xs rounded-full pl-9 pr-4 py-2 border border-brand-border/60 focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy placeholder:text-brand-dark/40"
            />
            <Search className="w-4 h-4 text-brand-burgundy-light absolute left-3 pointer-events-none" />
          </form>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-brand-dark">
            {/* Mobile search trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 hover:text-brand-burgundy transition"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:text-brand-burgundy transition"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlist > 0 && (
                <span className="absolute top-1 right-1 bg-brand-burgundy text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 hover:text-brand-burgundy transition"
              aria-label="Customer account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-brand-blush hover:bg-brand-rose/30 text-brand-burgundy rounded-full transition flex items-center gap-1.5 px-3"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-semibold">{totalItems}</span>
            </button>

            {/* Admin Quick Link */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-brand-burgundy bg-brand-blush/80 px-2.5 py-1 rounded-md border border-brand-rose/40 hover:bg-brand-burgundy hover:text-white transition"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {searchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search gifts, chocolates, hampers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-brand-blush text-brand-dark text-sm rounded-lg pl-10 pr-4 py-2 border border-brand-border focus:outline-none focus:border-brand-burgundy"
              />
              <Search className="w-4 h-4 text-brand-burgundy absolute left-3 top-3" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white border-b border-brand-border shadow-2xl p-5 z-50 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-brand-dark hover:text-brand-burgundy"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-brand-dark hover:text-brand-burgundy"
            >
              Shop All Gifts
            </Link>
            <Link
              href="/category/couple-gifts"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-brand-burgundy"
            >
              Couple Gifts & Romantics
            </Link>
            <Link
              href="/category/personalized-gifts"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-brand-dark hover:text-brand-burgundy"
            >
              Personalized Keepsakes
            </Link>

            <div className="border-t border-brand-border pt-3">
              <span className="text-xs uppercase font-bold text-brand-burgundy tracking-wider block mb-2">
                Occasions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {OCCASIONS_LIST.map((occ) => (
                  <Link
                    key={occ.slug}
                    href={`/category/${occ.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-brand-dark/80 hover:text-brand-burgundy py-1"
                  >
                    {occ.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-brand-border pt-3 flex flex-col space-y-2 text-sm text-brand-dark">
              <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-burgundy">
                Track My Order
              </Link>
              <Link href="/delivery-info" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-burgundy">
                Delivery Information
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-burgundy">
                Contact & Support
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-brand-burgundy font-semibold flex items-center gap-1 pt-1">
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
