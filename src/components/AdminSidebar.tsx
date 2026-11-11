'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Package, 
  ClipboardList, 
  Layers, 
  TicketPercent, 
  Settings, 
  ExternalLink, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';

export const AdminSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'All Products', icon: ShoppingBag, exact: true },
    { href: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
    { href: '/admin/inventory', label: 'Inventory & Stock', icon: Package },
    { href: '/admin/orders', label: 'Orders & Payments', icon: ClipboardList },
    { href: '/admin/categories', label: 'Categories & Occasions', icon: Layers },
    { href: '/admin/coupons', label: 'Coupons & Discounts', icon: TicketPercent },
    { href: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-brand-cream/30 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-brand-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Logo height={36} />
          <span className="text-[10px] font-bold uppercase bg-brand-blush text-brand-burgundy px-2 py-0.5 rounded-full border border-brand-border">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-brand-dark hover:bg-brand-blush rounded-lg transition"
          aria-label="Toggle admin navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-brand-border flex flex-col justify-between transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-brand-border flex items-center justify-between">
            <div>
              <Logo height={42} />
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-brand-burgundy bg-brand-blush px-2.5 py-1 rounded-md border border-brand-border w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Management</span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-brand-dark/60 hover:text-brand-dark"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-brand-burgundy text-white shadow-sm'
                      : 'text-brand-dark/70 hover:bg-brand-blush hover:text-brand-burgundy'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-brand-rose' : 'text-brand-dark/50'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Quick Links */}
        <div className="p-4 border-t border-brand-border bg-brand-cream/30 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-brand-dark hover:bg-white border border-brand-border transition group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-burgundy" />
              <span>View Customer Shop</span>
            </span>
            <span className="text-[10px] text-brand-dark/40 group-hover:text-brand-burgundy">&rarr;</span>
          </Link>
          <div className="px-3 text-[10px] text-brand-dark/50 text-center">
            GiftNao v2.0 • Nationwide Bangladesh
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
