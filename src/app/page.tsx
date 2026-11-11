'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  Gift, 
  Truck, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Mail
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../lib/types';
import { StoreService } from '../lib/storeService';
import { OCCASIONS_LIST } from '../lib/sampleData';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    StoreService.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blush/60 via-brand-cream to-white pt-10 pb-16 sm:py-24 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-rose/20 text-brand-burgundy text-xs font-semibold tracking-wide">
                <Heart className="w-3.5 h-3.5 text-brand-burgundy fill-current" />
                <span>Express Your Love Across Bangladesh</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-burgundy tracking-tight leading-[1.15]">
                A Little Box of <br />
                <span className="italic font-normal text-brand-burgundy-light">Big Feelings</span>
              </h1>

              <p className="text-base sm:text-lg text-brand-dark/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Thoughtful gifts for your special someone. Make every moment unforgettable with GiftNao — from luxury handcrafted couple boxes to personalized romantic keepsakes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/category/couple-gifts"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy-hover text-white font-medium text-sm transition shadow-lg shadow-brand-burgundy/20 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Shop Couple Gifts</span>
                </Link>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-brand-blush text-brand-burgundy border border-brand-border font-medium text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore All Gifts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-brand-border/60 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="font-serif text-lg font-bold text-brand-burgundy">64</p>
                  <p className="text-[11px] text-brand-dark/70">Districts Covered</p>
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-brand-burgundy">100%</p>
                  <p className="text-[11px] text-brand-dark/70">Handcrafted Curation</p>
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-brand-burgundy">COD</p>
                  <p className="text-[11px] text-brand-dark/70">& MFS Payments</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
                  alt="Romantic Gift Box with chocolates and handwritten card"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Floating Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-border shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
                      <Sparkles className="w-5 h-5 text-brand-burgundy" />
                    </div>
                    <div>
                      <p className="text-xs font-serif font-bold text-brand-dark">Signature Burgundy Box</p>
                      <p className="text-[10px] text-brand-dark/60">Chocolates, custom card & keepsakes</p>
                    </div>
                  </div>
                  <Link
                    href="/category/couple-gifts"
                    className="text-xs font-semibold text-brand-burgundy hover:underline flex items-center"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Brand Value Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-brand-border/70 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold text-brand-dark">Curated with Love</h3>
            <p className="text-xs text-brand-dark/70 leading-relaxed">Hand-selected imported treats and artisanal gifts.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border/70 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold text-brand-dark">Nationwide Delivery</h3>
            <p className="text-xs text-brand-dark/70 leading-relaxed">Swift and safe shipping to every district in Bangladesh.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border/70 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold text-brand-dark">Flexible Payment</h3>
            <p className="text-xs text-brand-dark/70 leading-relaxed">Cash on Delivery, bKash, Nagad, and Rocket.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border/70 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-brand-blush flex items-center justify-center text-brand-burgundy">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-semibold text-brand-dark">Personalized Touch</h3>
            <p className="text-xs text-brand-dark/70 leading-relaxed">Free custom love notes & secret surprise delivery.</p>
          </div>
        </div>
      </section>

      {/* 3. Shop by Occasion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
            Every Moment Celebrated
          </span>
          <h2 className="font-serif text-3xl font-bold text-brand-dark mt-1">
            Shop By Occasion
          </h2>
          <p className="text-sm text-brand-dark/70 mt-2">
            Find the exact gift that captures the emotion of your special day.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {OCCASIONS_LIST.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="group p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-burgundy/50 hover:shadow-lg transition-all text-center flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-brand-blush group-hover:bg-brand-burgundy transition flex items-center justify-center text-brand-burgundy group-hover:text-white">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-brand-dark group-hover:text-brand-burgundy transition">
                  {item.name}
                </h3>
                <p className="text-xs text-brand-dark/60 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-2 text-[11px] font-semibold text-brand-burgundy flex items-center justify-center gap-1">
                <span>View Gifts</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Romantic Gifts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-dark mt-1">
              Featured Gift Hampers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-brand-burgundy hover:text-brand-burgundy-hover flex items-center gap-1"
          >
            <span>See All Hampers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-brand-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Romantic Experience Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-brand-burgundy text-white p-8 sm:p-14">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wider uppercase text-brand-rose">
              Surprise Gifting Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Sending a Surprise to Someone Special?
            </h2>
            <p className="text-sm sm:text-base text-brand-rose/90 font-light leading-relaxed">
              We handle secret deliveries with zero invoices inside the box, beautiful wax seals, customized love letters, and timely phone coordination with the recipient.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-burgundy hover:bg-brand-blush rounded-xl text-xs font-semibold transition shadow-md"
              >
                <span>Browse Romantic Boxes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
              Most Loved
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-dark mt-1">
              GiftNao Bestsellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-brand-burgundy hover:text-brand-burgundy-hover flex items-center gap-1"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-brand-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 7. FAQs Preview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-brand-burgundy uppercase tracking-widest">
            Common Questions
          </span>
          <h2 className="font-serif text-3xl font-bold text-brand-dark mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-brand-border">
            <h3 className="font-serif text-base font-semibold text-brand-dark">
              How does delivery work across Bangladesh?
            </h3>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2 leading-relaxed">
              We deliver inside Dhaka within 24–48 hours, and to all other 63 districts within 2–4 business days via verified courier services.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border">
            <h3 className="font-serif text-base font-semibold text-brand-dark">
              Can I send a gift anonymously or as a surprise?
            </h3>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2 leading-relaxed">
              Yes! At checkout, simply tick the "Surprise Gift" option. We will never include the receipt or order price inside the package, and we will only contact the recipient at the delivery moment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border">
            <h3 className="font-serif text-base font-semibold text-brand-dark">
              What payment methods do you accept?
            </h3>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2 leading-relaxed">
              We accept Cash on Delivery (COD) in eligible areas, as well as manual mobile banking payments via bKash, Nagad, and Rocket with verified Transaction IDs.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/faqs"
            className="text-xs font-semibold text-brand-burgundy hover:underline"
          >
            View all frequently asked questions &rarr;
          </Link>
        </div>
      </section>

      {/* 8. Newsletter Consent */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-blush/60 rounded-3xl p-8 sm:p-12 border border-brand-border text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white flex items-center justify-center text-brand-burgundy shadow-sm">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
            Join the GiftNao Family
          </h2>
          <p className="text-xs sm:text-sm text-brand-dark/70 max-w-md mx-auto">
            Subscribe to receive occasional romantic gift guides, anniversary reminders, and seasonal specials. No spam, ever.
          </p>

          {newsletterSubscribed ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you for subscribing! We look forward to sharing thoughtful inspiration with you.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-burgundy"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy-hover text-white text-xs font-semibold rounded-xl transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
