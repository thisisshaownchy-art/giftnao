-- ==============================================================================
-- GiftNao Sample Seed Data (For Demonstration & Testing)
-- ==============================================================================

-- 1. Insert Initial Store Settings
INSERT INTO public.store_settings (
  id, store_name, phone, whatsapp, email, address, 
  inside_dhaka_shipping, outside_dhaka_shipping, announcement_text,
  bkash_number, bkash_type, nagad_number, nagad_type, rocket_number, rocket_type
) VALUES (
  1,
  'GiftNao',
  '[YOUR_BUSINESS_PHONE]',
  '[YOUR_WHATSAPP_NUMBER]',
  '[YOUR_BUSINESS_EMAIL]',
  '[YOUR_VERIFIED_BUSINESS_ADDRESS]',
  70,
  130,
  'Nationwide delivery across Bangladesh • Cash on Delivery & bKash / Nagad / Rocket available',
  '01XXXXXXXXX',
  'Personal',
  '01XXXXXXXXX',
  'Personal',
  '01XXXXXXXXX',
  'Personal'
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Categories
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

-- 3. Initial Sample Products
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
ON CONFLICT (slug) DO NOTHING;
