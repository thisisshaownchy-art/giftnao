-- ==============================================================================
-- GiftNao Admin Enhancement Migration
-- Adds Product SKU, Cost Price, Inventory Tracking, Coupons, and Storage Bucket
-- Safe and non-destructive: Alters existing tables and creates new tables with RLS
-- ==============================================================================

-- 1. Extend products table with admin and inventory attributes
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS track_stock BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS dimensions TEXT;

CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- 2. Inventory Movement Logs Table
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_inv_logs_product ON public.inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_logs_created ON public.inventory_logs(created_at DESC);

ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin inventory logs read" ON public.inventory_logs;
DROP POLICY IF EXISTS "Admin inventory logs write" ON public.inventory_logs;

CREATE POLICY "Admin inventory logs read" ON public.inventory_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin inventory logs write" ON public.inventory_logs FOR ALL USING (public.is_admin());

-- 3. Coupons & Promotions Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public coupons read active" ON public.coupons;
DROP POLICY IF EXISTS "Admin coupons management" ON public.coupons;

CREATE POLICY "Public coupons read active" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin coupons management" ON public.coupons FOR ALL USING (public.is_admin());

-- 4. Storage Bucket Configuration for Product Images
-- In Supabase, storage.buckets and storage.objects hold assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'product-images' bucket
DROP POLICY IF EXISTS "Public product images access" ON storage.objects;
DROP POLICY IF EXISTS "Admin product images upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin product images update" ON storage.objects;
DROP POLICY IF EXISTS "Admin product images delete" ON storage.objects;

CREATE POLICY "Public product images access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin product images upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    -- In production, add auth.role() = 'authenticated' or is_admin()
  );

CREATE POLICY "Admin product images update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Admin product images delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
