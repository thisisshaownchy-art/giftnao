-- ==============================================================================
-- GiftNao Master Database Setup Script for Supabase
-- Single-file, 100% idempotent setup: Schema + Security Policies + Seed Data
-- Run this in Supabase Dashboard -> SQL Editor -> Click "Run"
-- ==============================================================================

-- 1. Safely Create Custom Types (Checks if exists to prevent duplicate_object error)
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('customer', 'admin', 'concierge');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('cod', 'bkash', 'nagad', 'rocket');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('pending', 'awaiting_verification', 'paid', 'failed', 'refunded', 'cod_due', 'cod_collected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_type AS ENUM ('pending_confirmation', 'confirmed', 'processing', 'ready_for_dispatch', 'shipped', 'delivered', 'cancelled', 'returned');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role app_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  occasions TEXT[] DEFAULT '{}',
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_available BOOLEAN DEFAULT TRUE,
  is_personalizable BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  ingredients TEXT,
  allergens TEXT,
  weight TEXT,
  expiry_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  is_surprise_gift BOOLEAN DEFAULT FALSE,
  district TEXT NOT NULL,
  area TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  address_instructions TEXT,
  gift_message TEXT,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_charge NUMERIC(10, 2) NOT NULL DEFAULT 70 CHECK (shipping_charge >= 0),
  discount NUMERIC(10, 2) DEFAULT 0 CHECK (discount >= 0),
  final_total NUMERIC(10, 2) NOT NULL CHECK (final_total >= 0),
  payment_method payment_method_type NOT NULL DEFAULT 'cod',
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  payment_phone TEXT,
  payment_submitted_at TIMESTAMPTZ,
  payment_verified_at TIMESTAMPTZ,
  order_status order_status_type NOT NULL DEFAULT 'pending_confirmation',
  courier_name TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  variant_name TEXT,
  personalization_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'GiftNao',
  phone TEXT DEFAULT '[YOUR_BUSINESS_PHONE]',
  whatsapp TEXT DEFAULT '[YOUR_WHATSAPP_NUMBER]',
  email TEXT DEFAULT '[YOUR_BUSINESS_EMAIL]',
  address TEXT DEFAULT '[YOUR_VERIFIED_BUSINESS_ADDRESS]',
  facebook_url TEXT DEFAULT '[YOUR_FACEBOOK_URL]',
  instagram_url TEXT DEFAULT '[YOUR_INSTAGRAM_URL]',
  business_hours TEXT DEFAULT '[YOUR_BUSINESS_HOURS]',
  inside_dhaka_shipping NUMERIC(10, 2) DEFAULT 70,
  outside_dhaka_shipping NUMERIC(10, 2) DEFAULT 130,
  announcement_text TEXT,
  bkash_number TEXT DEFAULT '01XXXXXXXXX',
  bkash_type TEXT DEFAULT 'Personal',
  nagad_number TEXT DEFAULT '01XXXXXXXXX',
  nagad_type TEXT DEFAULT 'Personal',
  rocket_number TEXT DEFAULT '01XXXXXXXXX',
  rocket_type TEXT DEFAULT 'Personal',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 9. Indexes for High-Traffic Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_recipient_phone ON public.orders(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- 10. Enable Row Level Security (RLS) on all exposed tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 11. Helper Function: Check Admin Role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Security Policies (Drop first to make fully repeatable)
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
DROP POLICY IF EXISTS "Admin categories write" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin categories write" ON public.categories FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public products read" ON public.products;
DROP POLICY IF EXISTS "Admin products write" ON public.products;
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (is_available = true OR public.is_admin());
CREATE POLICY "Admin products write" ON public.products FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public order creation" ON public.orders;
DROP POLICY IF EXISTS "User/Admin order read" ON public.orders;
DROP POLICY IF EXISTS "Admin order update" ON public.orders;
CREATE POLICY "Public order creation" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "User/Admin order read" ON public.orders FOR SELECT USING (
  customer_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "Admin order update" ON public.orders FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Public order items insert" ON public.order_items;
DROP POLICY IF EXISTS "User/Admin order items read" ON public.order_items;
CREATE POLICY "Public order items insert" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "User/Admin order items read" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE public.orders.id = order_items.order_id
    AND (public.orders.customer_id = auth.uid() OR public.is_admin())
  )
);

DROP POLICY IF EXISTS "Public store settings read" ON public.store_settings;
DROP POLICY IF EXISTS "Admin store settings write" ON public.store_settings;
CREATE POLICY "Public store settings read" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin store settings write" ON public.store_settings FOR ALL USING (public.is_admin());

-- 13. Pre-Seed Default Store Settings
INSERT INTO public.store_settings (
  id, store_name, phone, whatsapp, email, address, 
  inside_dhaka_shipping, outside_dhaka_shipping, announcement_text,
  bkash_number, bkash_type, nagad_number, nagad_type, rocket_number, rocket_type
) VALUES (
  1,
  'GiftNao',
  '01866371040',
  '01866371040',
  'support@giftnao.com',
  'Dhaka, Bangladesh',
  70,
  130,
  'Nationwide delivery across Bangladesh • Cash on Delivery & bKash / Nagad / Rocket available',
  '01866371040',
  'Personal',
  '01866371040',
  'Personal',
  '01866371040',
  'Personal'
) ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  bkash_number = EXCLUDED.bkash_number,
  nagad_number = EXCLUDED.nagad_number,
  rocket_number = EXCLUDED.rocket_number,
  announcement_text = EXCLUDED.announcement_text;

-- 14. Pre-Seed Categories
INSERT INTO public.categories (slug, name, description) VALUES
('couple-gifts', 'Couple Gifts', 'Curated romance for you and your beloved'),
('birthday-gifts', 'Birthday Gifts', 'Surprise celebration boxes to brighten their year'),
('anniversary-gifts', 'Anniversary Gifts', 'Commemorate your love and milestones together'),
('valentines-day', 'Valentine''s Day', 'Heartfelt romantic expressions and sweet treats'),
('new-year', 'New Year Gifts', 'Fresh beginnings and joyful celebratory gift packs'),
('bengali-new-year', 'Bengali New Year', 'Traditional Pohela Boishakh delights and hampers'),
('chocolates-sweets', 'Chocolates & Sweets', 'Artisanal confections, imported chocolates, and delicacies'),
('personalized-gifts', 'Personalized Gifts', 'Engraved, custom photo keepsakes and romantic cards')
ON CONFLICT (slug) DO NOTHING;

-- 15. Pre-Seed Products
INSERT INTO public.products (
  slug, name, short_description, description, price, compare_at_price,
  category_name, category_slug, occasions, stock_quantity, is_available,
  is_personalizable, is_featured, is_bestseller, images
) VALUES
(
  'mini-chocolate-love-box',
  'Mini Chocolate Love Box',
  'Delicate mini assortment of premium chocolates with a romantic customized note.',
  'A sweet and tender surprise for everyday affection. Includes fine imported chocolates, silk rose petals, and a handwritten calligraphic love note nestled in our signature burgundy GiftNao presentation box.',
  950, 1200,
  'Chocolates & Sweets', 'chocolates-sweets',
  ARRAY['Couple Gifts', 'Valentine''s Day', 'Chocolates & Sweets'],
  24, true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80']
),
(
  'romantic-couple-box',
  'Romantic Couple Box',
  'Couples keepsake treasure with his-and-hers scented candles, chocolates, and custom memory booklet.',
  'Designed exclusively to spark connection and cherished moments. This romantic curation features artisan soy candles, Belgium truffles, matching couple bracelets, and a velvet-lined photo holder with your customized anniversary or love message.',
  2450, 2800,
  'Couple Gifts', 'couple-gifts',
  ARRAY['Couple Gifts', 'Anniversary Gifts', 'Valentine''s Day'],
  18, true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80']
),
(
  'chocolate-delight-box',
  'Chocolate Delight Box',
  'Rich assortment of Ferrero Rocher, gourmet pralines, and dark chocolate bars.',
  'A chocolate lover''s ultimate fantasy! Handcrafted with luxury chocolates from around the world, garnished with golden ribbons and packaged in an opulent GiftNao magnetic burgundy keepsake chest.',
  1850, 2100,
  'Chocolates & Sweets', 'chocolates-sweets',
  ARRAY['Birthday Gifts', 'Chocolates & Sweets', 'New Year'],
  30, true, true, true, false,
  ARRAY['https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=800&q=80']
),
(
  'birthday-surprise-box',
  'Birthday Surprise Box',
  'Festive birthday hamper complete with celebration confetti, party treats, scented candle, and custom birthday card.',
  'Make their birthday unforgettable from miles away. Packed with vibrant celebratory elements, gourmet mini cookies, a birthday wishing bell, and a custom photo greetings card.',
  2150, 2500,
  'Birthday Gifts', 'birthday-gifts',
  ARRAY['Birthday Gifts'],
  15, true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80']
),
(
  'anniversary-memory-box',
  'Anniversary Memory Box',
  'Luxurious velvet box with wooden memory album, eternal golden rose, and romantic letter cylinder.',
  'Celebrate years of togetherness with timeless elegance. Comes with a personalized wooden photo album engraved with both your names and milestone date, alongside an everlasting gilded rose.',
  3200, 3600,
  'Anniversary Gifts', 'anniversary-gifts',
  ARRAY['Anniversary Gifts', 'Couple Gifts'],
  12, true, true, true, false,
  ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80']
),
(
  'personalized-photo-gift-set',
  'Personalized Photo Gift Set',
  'Custom acrylic photo frame, warm ambient fairy lights, and personalized Spotify acrylic plaque with your song.',
  'Turn your favorite shared song and photo into an artistic illuminated display. Connects to your favorite romantic anthem with scannable Spotify code, paired with fairy light warmth.',
  1650, 1950,
  'Personalized Gifts', 'personalized-gifts',
  ARRAY['Personalized Gifts', 'Couple Gifts', 'Anniversary Gifts', 'Valentine''s Day'],
  25, true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80']
),
(
  'premium-valentines-box',
  'Premium Valentine''s Box',
  'Ultimate romantic grand hamper with imported chocolates, plush teddy, preserved rose, and love scroll.',
  'The epitome of Valentine romance. Features a handcrafted preserved rose in glass dome that lasts for years, premium Swiss chocolates, gentle plush heart mascot, and romantic message sealed with burgundy wax.',
  3800, 4500,
  'Valentine''s Day', 'valentines-day',
  ARRAY['Valentine''s Day', 'Couple Gifts'],
  8, true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80']
),
(
  'build-your-own-gift-box',
  'Build-Your-Own Gift Box',
  'Choose your preferred custom box style, gourmet treats, and personalized accessories.',
  'Tailor-made perfection! Select from our luxury matte burgundy boxes, pick hand-selected treats, candles, or accessories, and dictate every single line of your romantic personalized note.',
  1500, 1750,
  'Personalized Gifts', 'personalized-gifts',
  ARRAY['Personalized Gifts', 'Couple Gifts', 'New Year', 'Bengali New Year'],
  50, true, true, true, false,
  ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  stock_quantity = EXCLUDED.stock_quantity;
