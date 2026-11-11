-- ==============================================================================
-- GiftNao E-Commerce Database Schema Migration
-- Database: PostgreSQL (Supabase)
-- Currency: BDT (Bangladeshi Taka)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum & Table
CREATE TYPE app_role AS ENUM ('customer', 'admin', 'concierge');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role app_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 3. Categories & Occasions
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= price),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id),
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

-- 5. Orders Table
CREATE TYPE payment_method_type AS ENUM ('cod', 'bkash', 'nagad', 'rocket');
CREATE TYPE payment_status_type AS ENUM ('pending', 'awaiting_verification', 'paid', 'failed', 'refunded', 'cod_due', 'cod_collected');
CREATE TYPE order_status_type AS ENUM ('pending_confirmation', 'confirmed', 'processing', 'ready_for_dispatch', 'shipped', 'delivered', 'cancelled', 'returned');

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 7. Store Settings Table
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

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_recipient_phone ON public.orders(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Helper to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Categories: Public can read, Admins can write
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin categories write" ON public.categories FOR ALL USING (public.is_admin());

-- 2. Products: Public can read available, Admins can write
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (is_available = true OR public.is_admin());
CREATE POLICY "Admin products write" ON public.products FOR ALL USING (public.is_admin());

-- 3. Orders: Anyone can create (guest checkout), Customer reads their own, Admin reads all
CREATE POLICY "Public order creation" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "User/Admin order read" ON public.orders FOR SELECT USING (
  customer_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "Admin order update" ON public.orders FOR UPDATE USING (public.is_admin());

-- 4. Order Items: Insert allowed with order, read allowed if order is accessible
CREATE POLICY "Public order items insert" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "User/Admin order items read" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE public.orders.id = order_items.order_id
    AND (public.orders.customer_id = auth.uid() OR public.is_admin())
  )
);

-- 5. Store Settings: Public can read, Admin can update
CREATE POLICY "Public store settings read" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin store settings write" ON public.store_settings FOR ALL USING (public.is_admin());
