import './globals.css';
import type { Metadata } from 'next';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';

export const metadata: Metadata = {
  title: 'GiftNao - Gifts That Speak from the Heart | Bangladesh',
  description:
    'Thoughtful, romantic, and personalized gifting for couples and loved ones across Bangladesh. Cash on Delivery, bKash, Nagad, and Rocket accepted.',
  keywords: [
    'gifts Bangladesh',
    'couple gifts Dhaka',
    'personalized gifts BD',
    'valentine gifts',
    'chocolates',
    'anniversary boxes',
    'birthday gift hamper',
  ],
  openGraph: {
    title: 'GiftNao - Gifts That Speak from the Heart',
    description:
      'Order romantic, thoughtful, and custom gift hampers online with nationwide delivery across Bangladesh.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between selection:bg-brand-rose selection:text-brand-burgundy">
        <CartProvider>
          <WishlistProvider>
            <AnnouncementBar />
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
