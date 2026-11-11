-- ==============================================================================
-- GiftNao MASTER SETUP SQL FOR SUPABASE
-- Run this ONCE in Supabase Dashboard -> SQL Editor -> Click "Run" (Green button)
-- Project: dijuvqwgdydbikypgeuz
-- ==============================================================================

-- 1. Safely Create Custom Enums (Checks if exists to prevent duplicate_object error)
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('customer', 'admin', 'concierge');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('cod', 'bkash', 'nagad', 'rocket');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('pending', 'awaiting_verification', 'paid', 'failed', 'refunded', 'cod_due', 'cod_collected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_type AS ENUM ('pending_confirmation', 'confirmed', 'processing', 'ready_for_dispatch', 'shipped', 'delivered', 'cancelled', 'returned');
EXCEPTION WHEN duplicate_object THEN null;
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
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role app_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2),
  cost_price NUMERIC(10, 2),
  images TEXT[] DEFAULT '{}',
  category_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  occasions TEXT[] DEFAULT '{}',
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  track_stock BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_available BOOLEAN DEFAULT TRUE,
  is_personalizable BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  dimensions TEXT,
  ingredients TEXT,
  allergens TEXT,
  weight TEXT,
  expiry_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure admin enhancement columns exist if products table was created earlier
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS track_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions TEXT;

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT,
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
  phone TEXT DEFAULT '01866371040',
  whatsapp TEXT DEFAULT '01866371040',
  email TEXT DEFAULT 'support@giftnao.com',
  address TEXT DEFAULT 'Dhaka, Bangladesh',
  facebook_url TEXT DEFAULT 'https://facebook.com/giftnaobd',
  instagram_url TEXT DEFAULT 'https://instagram.com/giftnaobd',
  business_hours TEXT DEFAULT '10:00 AM - 10:00 PM (Everyday)',
  inside_dhaka_shipping NUMERIC(10, 2) DEFAULT 70,
  outside_dhaka_shipping NUMERIC(10, 2) DEFAULT 130,
  announcement_text TEXT DEFAULT 'Nationwide delivery across Bangladesh • Cash on Delivery & bKash / Nagad / Rocket available',
  bkash_number TEXT DEFAULT '01866371040',
  bkash_type TEXT DEFAULT 'Personal',
  nagad_number TEXT DEFAULT '01866371040',
  nagad_type TEXT DEFAULT 'Personal',
  rocket_number TEXT DEFAULT '01866371040',
  rocket_type TEXT DEFAULT 'Personal',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 9. Inventory Movement Logs Table
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  sku TEXT,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('restock', 'manual_adjustment', 'order_fulfillment', 'order_cancellation', 'damage')),
  notes TEXT,
  admin_name TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Coupons & Promotions Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_purchase NUMERIC(10, 2) DEFAULT 0,
  max_discount NUMERIC(10, 2),
  expiry_date TIMESTAMPTZ,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Indexes for Maximum Query Speed
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_recipient_phone ON public.orders(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_inv_logs_product ON public.inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_logs_created ON public.inventory_logs(created_at DESC);

-- 12. Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check Admin Role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe Policy Drop & Recreate
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
DROP POLICY IF EXISTS "Public categories write" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public categories write" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public products read" ON public.products;
DROP POLICY IF EXISTS "Public products write" ON public.products;
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public products write" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public orders read" ON public.orders;
DROP POLICY IF EXISTS "Public orders write" ON public.orders;
CREATE POLICY "Public orders read" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public orders write" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public order items read" ON public.order_items;
DROP POLICY IF EXISTS "Public order items write" ON public.order_items;
CREATE POLICY "Public order items read" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Public order items write" ON public.order_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Public store settings read" ON public.store_settings;
DROP POLICY IF EXISTS "Public store settings write" ON public.store_settings;
CREATE POLICY "Public store settings read" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public store settings write" ON public.store_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public inventory logs read" ON public.inventory_logs;
DROP POLICY IF EXISTS "Public inventory logs write" ON public.inventory_logs;
CREATE POLICY "Public inventory logs read" ON public.inventory_logs FOR SELECT USING (true);
CREATE POLICY "Public inventory logs write" ON public.inventory_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Public coupons read" ON public.coupons;
DROP POLICY IF EXISTS "Public coupons write" ON public.coupons;
CREATE POLICY "Public coupons read" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public coupons write" ON public.coupons FOR ALL USING (true);

-- 13. Supabase Storage Setup for Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public product images access" ON storage.objects;
DROP POLICY IF EXISTS "Public product images upload" ON storage.objects;
DROP POLICY IF EXISTS "Public product images update" ON storage.objects;
DROP POLICY IF EXISTS "Public product images delete" ON storage.objects;

CREATE POLICY "Public product images access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public product images upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public product images update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Public product images delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- 14. Seed Store Settings (Business Phone & MFS: 01866371040)
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
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  bkash_number = EXCLUDED.bkash_number,
  nagad_number = EXCLUDED.nagad_number,
  rocket_number = EXCLUDED.rocket_number,
  announcement_text = EXCLUDED.announcement_text;

-- 15. Seed Categories
INSERT INTO public.categories (slug, name, description) VALUES
('couple-gifts', 'Couple Gifts', 'Curated romance for you and your beloved'),
('birthday-gifts', 'Birthday Gifts', 'Surprise celebration boxes to brighten their year'),
('anniversary-gifts', 'Anniversary Gifts', 'Commemorate your love and milestones together'),
('valentines-day', 'Valentine''s Day', 'Heartfelt romantic expressions and sweet treats'),
('new-year', 'New Year Gifts', 'Fresh beginnings and joyful celebratory gift packs'),
('bengali-new-year', 'Bengali New Year', 'Traditional Pohela Boishakh delights and hampers'),
('chocolates-sweets', 'Chocolates & Sweets', 'Artisanal confections, imported chocolates, and delicacies'),
('personalized-gifts', 'Personalized Gifts', 'Engraved, custom photo keepsakes and romantic cards')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 16. Seed Sample Promotional Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_purchase, max_discount, is_active) VALUES
('GIFTNAO10', 'percentage', 10, 1000, 500, true),
('LOVE200', 'fixed', 200, 1500, 200, true)
ON CONFLICT (code) DO UPDATE SET
  discount_value = EXCLUDED.discount_value,
  is_active = true;

-- 17. Seed Catalog Products
INSERT INTO public.products (
  id, slug, sku, name, short_description, description, price, compare_at_price, cost_price,
  category_name, category_slug, occasions, stock_quantity, low_stock_threshold,
  track_stock, status, is_available, is_personalizable, is_featured, is_bestseller, images
) VALUES
(
  'prod-001',
  'mini-chocolate-love-box',
  'GN-MINI-001',
  'Mini Chocolate Love Box',
  'Delicate mini assortment of premium chocolates with a romantic customized note.',
  'A sweet and tender surprise for everyday affection. Includes fine imported chocolates, silk rose petals, and a handwritten calligraphic love note nestled in our signature burgundy GiftNao presentation box.',
  950, 1200, 600,
  'Chocolates & Sweets', 'chocolates-sweets',
  ARRAY['Couple Gifts', 'Valentine''s Day', 'Chocolates & Sweets'],
  24, 5, true, 'published', true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80']
),
(
  'prod-002',
  'romantic-couple-box',
  'GN-CPL-002',
  'Romantic Couple Box',
  'Couples keepsake treasure with his-and-hers scented candles, chocolates, and custom memory booklet.',
  'Designed exclusively to spark connection and cherished moments. This romantic curation features artisan soy candles, Belgium truffles, matching couple bracelets, and a velvet-lined photo holder with your customized anniversary or love message.',
  2450, 2800, 1600,
  'Couple Gifts', 'couple-gifts',
  ARRAY['Couple Gifts', 'Anniversary Gifts', 'Valentine''s Day'],
  18, 5, true, 'published', true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80']
),
(
  'prod-003',
  'chocolate-delight-box',
  'GN-CHOC-003',
  'Chocolate Delight Box',
  'Rich assortment of Ferrero Rocher, gourmet pralines, and dark chocolate bars.',
  'A chocolate lover''s ultimate fantasy! Handcrafted with luxury chocolates from around the world, garnished with golden ribbons and packaged in an opulent GiftNao magnetic burgundy keepsake chest.',
  1850, 2100, 1200,
  'Chocolates & Sweets', 'chocolates-sweets',
  ARRAY['Birthday Gifts', 'Chocolates & Sweets', 'New Year'],
  30, 5, true, 'published', true, true, true, false,
  ARRAY['https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=800&q=80']
),
(
  'prod-004',
  'birthday-surprise-box',
  'GN-BDAY-004',
  'Birthday Surprise Box',
  'Festive birthday hamper complete with celebration confetti, party treats, scented candle, and custom birthday card.',
  'Make their birthday unforgettable from miles away. Packed with vibrant celebratory elements, gourmet mini cookies, a birthday wishing bell, and a custom photo greetings card.',
  2150, 2500, 1400,
  'Birthday Gifts', 'birthday-gifts',
  ARRAY['Birthday Gifts'],
  15, 5, true, 'published', true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80']
),
(
  'prod-005',
  'anniversary-memory-box',
  'GN-ANV-005',
  'Anniversary Memory Box',
  'Luxurious velvet box with wooden memory album, eternal golden rose, and romantic letter cylinder.',
  'Celebrate years of togetherness with timeless elegance. Comes with a personalized wooden photo album engraved with both your names and milestone date, alongside an everlasting gilded rose.',
  3200, 3600, 2100,
  'Anniversary Gifts', 'anniversary-gifts',
  ARRAY['Anniversary Gifts', 'Couple Gifts'],
  12, 5, true, 'published', true, true, true, false,
  ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80']
),
(
  'prod-006',
  'personalized-photo-gift-set',
  'GN-PHT-006',
  'Personalized Photo Gift Set',
  'Custom acrylic photo frame, warm ambient fairy lights, and personalized Spotify acrylic plaque with your song.',
  'Turn your favorite shared song and photo into an artistic illuminated display. Connects to your favorite romantic anthem with scannable Spotify code, paired with fairy light warmth.',
  1650, 1950, 950,
  'Personalized Gifts', 'personalized-gifts',
  ARRAY['Personalized Gifts', 'Couple Gifts', 'Anniversary Gifts', 'Valentine''s Day'],
  25, 5, true, 'published', true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80']
),
(
  'prod-007',
  'premium-valentines-box',
  'GN-VAL-007',
  'Premium Valentine''s Box',
  'Ultimate romantic grand hamper with imported chocolates, plush teddy, preserved rose, and love scroll.',
  'The epitome of Valentine romance. Features a handcrafted preserved rose in glass dome that lasts for years, premium Swiss chocolates, gentle plush heart mascot, and romantic message sealed with burgundy wax.',
  3800, 4500, 2400,
  'Valentine''s Day', 'valentines-day',
  ARRAY['Valentine''s Day', 'Couple Gifts'],
  8, 3, true, 'published', true, true, true, true,
  ARRAY['https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80']
),
(
  'prod-008',
  'build-your-own-gift-box',
  'GN-BYO-008',
  'Build-Your-Own Gift Box',
  'Choose your preferred custom box style, gourmet treats, and personalized accessories.',
  'Tailor-made perfection! Select from our luxury matte burgundy boxes, pick hand-selected treats, candles, or accessories, and dictate every single line of your romantic personalized note.',
  1500, 1750, 900,
  'Personalized Gifts', 'personalized-gifts',
  ARRAY['Personalized Gifts', 'Couple Gifts', 'New Year', 'Bengali New Year'],
  50, 10, true, 'published', true, true, true, false,
  ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80']
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  cost_price = EXCLUDED.cost_price,
  description = EXCLUDED.description,
  stock_quantity = EXCLUDED.stock_quantity,
  is_available = EXCLUDED.is_available,
  status = EXCLUDED.status;
