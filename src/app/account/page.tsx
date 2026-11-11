'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Heart, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Order } from '../../lib/types';
import { StoreService } from '../../lib/storeService';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'login'>('login');
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('Valued Customer');
  const [phone, setPhone] = useState('017XXXXXXXX');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Check if Supabase session or local session
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setIsLoggedIn(true);
          setEmail(data.user.email || '');
          setActiveTab('orders');
        }
      });
    } else {
      const storedUser = localStorage.getItem('giftnao_customer_session');
      if (storedUser) {
        setIsLoggedIn(true);
        const parsed = JSON.parse(storedUser);
        setEmail(parsed.email || '');
        setFullName(parsed.name || 'Valued Customer');
        setActiveTab('orders');
      }
    }

    StoreService.getAllOrders().then(setOrders);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!email || !password) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Try sign up if user doesn't exist
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) {
          setAuthError(signUpErr.message);
          return;
        }
        setAuthSuccess('Account created! Please check your email to confirm registration.');
      } else {
        setIsLoggedIn(true);
        setActiveTab('orders');
      }
    } else {
      // Local fallback session
      const user = { email, name: email.split('@')[0], phone: '017XXXXXXXX' };
      localStorage.setItem('giftnao_customer_session', JSON.stringify(user));
      setIsLoggedIn(true);
      setFullName(user.name);
      setActiveTab('orders');
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('giftnao_customer_session');
    setIsLoggedIn(false);
    setActiveTab('login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
          Customer Portal
        </h1>
        <p className="text-xs text-brand-dark/70 mt-1">
          Manage your profile, saved addresses, and order fulfillment history.
        </p>
      </div>

      {!isLoggedIn ? (
        /* Login / Register Card */
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-brand-border shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
              <User className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-bold text-brand-dark">Sign In / Register</h2>
            <p className="text-xs text-brand-dark/60">
              Access your order history and personalized preferences.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold rounded-xl transition shadow-md"
            >
              Sign In / Continue
            </button>
          </form>

          <div className="text-center text-[11px] text-brand-dark/60 border-t border-brand-border/60 pt-4">
            Guest checkout is always supported without creating an account.
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard */
        <div className="space-y-6">
          {/* Top Bar Navigation Tabs */}
          <div className="flex border-b border-brand-border gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === 'orders'
                  ? 'border-brand-burgundy text-brand-burgundy font-bold'
                  : 'border-transparent text-brand-dark/70 hover:text-brand-burgundy'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-brand-burgundy text-brand-burgundy font-bold'
                  : 'border-transparent text-brand-dark/70 hover:text-brand-burgundy'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="pb-3 ml-auto flex items-center gap-1.5 text-brand-dark/60 hover:text-rose-600 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="p-10 bg-white rounded-3xl border border-brand-border text-center space-y-3">
                  <Package className="w-12 h-12 mx-auto text-brand-dark/30" />
                  <h3 className="font-serif text-base font-bold text-brand-dark">No orders logged yet</h3>
                  <p className="text-xs text-brand-dark/60 max-w-sm mx-auto">
                    When you place romantic gift orders, they will appear here with full status tracking.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-5 py-2 bg-brand-burgundy text-white rounded-xl text-xs font-semibold"
                  >
                    Browse Gifts
                  </Link>
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-6 bg-white rounded-3xl border border-brand-border space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-border gap-2">
                      <div>
                        <span className="font-mono font-bold text-brand-burgundy text-sm">{o.orderNumber}</span>
                        <span className="text-xs text-brand-dark/60 ml-3">
                          Placed on {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-brand-blush text-brand-burgundy rounded-full text-[11px] font-bold uppercase">
                          {o.orderStatus.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-serif font-bold text-brand-dark">
                          ৳{o.finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-brand-dark/60 block">Recipient:</span>
                        <span className="font-medium text-brand-dark">{o.recipientName} ({o.recipientPhone})</span>
                      </div>
                      <div>
                        <span className="text-brand-dark/60 block">Delivery To:</span>
                        <span className="font-medium text-brand-dark">{o.area}, {o.district}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Link
                        href={`/track-order?orderNumber=${o.orderNumber}`}
                        className="px-4 py-2 bg-brand-blush hover:bg-brand-burgundy hover:text-white text-brand-burgundy rounded-xl text-xs font-semibold transition"
                      >
                        Track Status
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-3xl border border-brand-border space-y-6">
              <h3 className="font-serif text-lg font-bold text-brand-dark">Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">Email</label>
                  <input
                    type="text"
                    disabled
                    value={email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-blush/30 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
