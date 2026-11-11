import { 
  Product, 
  Order, 
  StoreSettings, 
  OrderStatus, 
  PaymentStatus,
  ProductStatus,
  InventoryLog,
  CategoryItem,
  Coupon 
} from './types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS, OCCASIONS_LIST } from './sampleData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  PRODUCTS: 'giftnao_products',
  ORDERS: 'giftnao_orders',
  SETTINGS: 'giftnao_settings',
  INVENTORY_LOGS: 'giftnao_inventory_logs',
  CATEGORIES: 'giftnao_categories',
  COUPONS: 'giftnao_coupons',
};

// Local storage helpers
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Local storage write error', e);
  }
}

// Convert Supabase Product Row to TS Product
function mapDbProduct(row: any): Product {
  const stock = Number(row.stock_quantity ?? row.stockQuantity ?? 0);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku || `GN-${String(row.slug || row.id || '').slice(0, 6).toUpperCase()}`,
    shortDescription: row.short_description || row.shortDescription || '',
    description: row.description || '',
    price: Number(row.price || 0),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : row.compareAtPrice,
    costPrice: row.cost_price ? Number(row.cost_price) : row.costPrice,
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'],
    category: row.category_name || row.category || 'Romantic Gifts',
    categorySlug: row.category_slug || row.categorySlug || 'couple-gifts',
    occasions: Array.isArray(row.occasions) ? row.occasions : ['Couple Gifts'],
    stockQuantity: stock,
    lowStockThreshold: row.low_stock_threshold ? Number(row.low_stock_threshold) : 5,
    trackStock: row.track_stock !== undefined ? Boolean(row.track_stock) : true,
    status: (row.status as ProductStatus) || (row.is_available === false ? 'draft' : 'published'),
    isAvailable: Boolean(row.is_available ?? (row.status !== 'draft' && row.status !== 'archived')),
    isPersonalizable: Boolean(row.is_personalizable ?? row.isPersonalizable ?? false),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured ?? false),
    isBestseller: Boolean(row.is_bestseller ?? row.isBestseller ?? false),
    dimensions: row.dimensions,
    ingredients: row.ingredients,
    allergens: row.allergens,
    weight: row.weight,
    expiryInfo: row.expiry_info || row.expiryInfo,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

// Convert Supabase Order Row to TS Order
function mapDbOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number || row.orderNumber,
    customerName: row.customer_name || row.customerName,
    customerPhone: row.customer_phone || row.customerPhone,
    customerEmail: row.customer_email || row.customerEmail,
    recipientName: row.recipient_name || row.recipientName,
    recipientPhone: row.recipient_phone || row.recipientPhone,
    isSurpriseGift: Boolean(row.is_surprise_gift ?? row.isSurpriseGift),
    district: row.district,
    area: row.area,
    deliveryAddress: row.delivery_address || row.deliveryAddress,
    addressInstructions: row.address_instructions || row.addressInstructions,
    giftMessage: row.gift_message || row.giftMessage,
    items: Array.isArray(row.order_items)
      ? row.order_items.map((it: any) => ({
          productId: it.product_id,
          productName: it.product_name,
          productSlug: it.product_slug,
          unitPrice: Number(it.unit_price),
          quantity: Number(it.quantity),
          subtotal: Number(it.subtotal),
          variantName: it.variant_name,
          personalizationText: it.personalization_text,
        }))
      : Array.isArray(row.items)
      ? row.items
      : [],
    subtotal: Number(row.subtotal || 0),
    shippingCharge: Number(row.shipping_charge ?? row.shippingCharge ?? 70),
    discount: Number(row.discount || 0),
    finalTotal: Number(row.final_total ?? row.finalTotal ?? 0),
    paymentMethod: row.payment_method || row.paymentMethod || 'cod',
    paymentStatus: row.payment_status || row.paymentStatus || 'pending',
    transactionId: row.transaction_id || row.transactionId,
    paymentPhone: row.payment_phone || row.paymentPhone,
    paymentSubmittedAt: row.payment_submitted_at || row.paymentSubmittedAt,
    paymentVerifiedAt: row.payment_verified_at || row.paymentVerifiedAt,
    orderStatus: row.order_status || row.orderStatus || 'pending_confirmation',
    courierName: row.courier_name || row.courierName,
    trackingNumber: row.tracking_number || row.trackingNumber,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

export const StoreService = {
  // ==========================================
  // PRODUCTS MANAGEMENT
  // ==========================================
  async getProducts(includeArchived = false): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('products').select('*');
        if (!includeArchived) {
          query = query.neq('status', 'archived');
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbProduct);
        }
      } catch (e) {
        console.warn('Supabase product query error, falling back to local', e);
      }
    }
    const local = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return includeArchived ? local : local.filter(p => p.status !== 'archived');
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts(true);
    return products.find(p => p.id === id) || null;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts(false);
    return products.find((p) => p.slug === slug) || null;
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const products = await this.getProducts(false);
    return products.filter((p) => 
      p.categorySlug === categorySlug || 
      p.occasions.some(occ => occ.toLowerCase().replace(/[^a-z0-9]+/g, '-') === categorySlug)
    );
  },

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts(false);
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return products;

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(cleanQuery);
      const matchSku = p.sku ? p.sku.toLowerCase().includes(cleanQuery) : false;
      const matchDesc = p.description.toLowerCase().includes(cleanQuery) || p.shortDescription.toLowerCase().includes(cleanQuery);
      const matchCat = p.category.toLowerCase().includes(cleanQuery);
      const matchOcc = p.occasions.some((o) => o.toLowerCase().includes(cleanQuery));
      return matchName || matchSku || matchDesc || matchCat || matchOcc;
    });
  },

  async saveProduct(productInput: Partial<Product>): Promise<Product> {
    const now = new Date().toISOString();
    const isNew = !productInput.id;
    const id = productInput.id || `prod_${Date.now()}`;
    const slug = productInput.slug || (productInput.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sku = productInput.sku || `GN-${slug.slice(0, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const product: Product = {
      id,
      slug,
      sku,
      name: productInput.name || 'Untitled Gift',
      shortDescription: productInput.shortDescription || '',
      description: productInput.description || '',
      price: Number(productInput.price || 0),
      compareAtPrice: productInput.compareAtPrice ? Number(productInput.compareAtPrice) : undefined,
      costPrice: productInput.costPrice ? Number(productInput.costPrice) : undefined,
      images: productInput.images && productInput.images.length > 0 ? productInput.images : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'],
      category: productInput.category || 'Couple Gifts',
      categorySlug: productInput.categorySlug || 'couple-gifts',
      occasions: productInput.occasions && productInput.occasions.length > 0 ? productInput.occasions : ['Couple Gifts'],
      stockQuantity: Number(productInput.stockQuantity ?? 15),
      lowStockThreshold: Number(productInput.lowStockThreshold ?? 5),
      trackStock: productInput.trackStock !== undefined ? Boolean(productInput.trackStock) : true,
      status: productInput.status || 'published',
      isAvailable: productInput.status ? productInput.status === 'published' : Boolean(productInput.isAvailable ?? true),
      isPersonalizable: Boolean(productInput.isPersonalizable),
      isFeatured: Boolean(productInput.isFeatured),
      isBestseller: Boolean(productInput.isBestseller),
      dimensions: productInput.dimensions,
      ingredients: productInput.ingredients,
      allergens: productInput.allergens,
      weight: productInput.weight,
      expiryInfo: productInput.expiryInfo,
      createdAt: productInput.createdAt || now,
      updatedAt: now,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          id: product.id,
          slug: product.slug,
          sku: product.sku,
          name: product.name,
          short_description: product.shortDescription,
          description: product.description,
          price: product.price,
          compare_at_price: product.compareAtPrice,
          cost_price: product.costPrice,
          images: product.images,
          category_name: product.category,
          category_slug: product.categorySlug,
          occasions: product.occasions,
          stock_quantity: product.stockQuantity,
          low_stock_threshold: product.lowStockThreshold,
          track_stock: product.trackStock,
          status: product.status,
          is_available: product.status === 'published',
          is_personalizable: product.isPersonalizable,
          is_featured: product.isFeatured,
          is_bestseller: product.isBestseller,
          dimensions: product.dimensions,
          ingredients: product.ingredients,
          allergens: product.allergens,
          weight: product.weight,
          expiry_info: product.expiryInfo,
          updated_at: now,
        };

        await supabase.from('products').upsert(dbPayload);
      } catch (e) {
        console.warn('Supabase product upsert error, keeping local', e);
      }
    }

    const current = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const existingIdx = current.findIndex(p => p.id === product.id);
    if (existingIdx !== -1) {
      current[existingIdx] = product;
    } else {
      current.unshift(product);
    }
    setLocalItem(STORAGE_KEYS.PRODUCTS, current);

    // Record initial inventory log if new
    if (isNew) {
      this.recordInventoryLog({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        previousStock: 0,
        newStock: product.stockQuantity,
        changeAmount: product.stockQuantity,
        reason: 'restock',
        notes: 'Initial catalog creation',
        adminName: 'Administrator',
      });
    }

    return product;
  },

  async duplicateProduct(productId: string): Promise<Product> {
    const original = await this.getProductById(productId);
    if (!original) throw new Error('Product not found');

    const timestamp = Date.now();
    const duplicated: Partial<Product> = {
      ...original,
      id: `prod_${timestamp}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
      sku: `GN-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'draft',
      isAvailable: false,
      isFeatured: false,
      isBestseller: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await this.saveProduct(duplicated);
  },

  async archiveProduct(productId: string): Promise<boolean> {
    const product = await this.getProductById(productId);
    if (!product) return false;
    product.status = 'archived';
    product.isAvailable = false;
    await this.saveProduct(product);
    return true;
  },

  async publishProduct(productId: string, publish: boolean): Promise<boolean> {
    const product = await this.getProductById(productId);
    if (!product) return false;
    product.status = publish ? 'published' : 'draft';
    product.isAvailable = publish;
    await this.saveProduct(product);
    return true;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    // Check if product is in any orders before hard delete
    const orders = await this.getAllOrders();
    const hasOrders = orders.some(o => o.items.some(i => i.productId === productId));
    if (hasOrders) {
      // Safe fallback: Archive instead of permanent deletion
      return await this.archiveProduct(productId);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (e) {
        console.warn('Supabase product delete error', e);
      }
    }

    const current = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = current.filter(p => p.id !== productId);
    setLocalItem(STORAGE_KEYS.PRODUCTS, updated);
    return true;
  },

  // ==========================================
  // INVENTORY & STOCK ADJUSTMENT
  // ==========================================
  async getInventoryLogs(): Promise<InventoryLog[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('inventory_logs').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            productId: d.product_id,
            productName: d.product_name,
            sku: d.sku,
            previousStock: d.previous_stock,
            newStock: d.new_stock,
            changeAmount: d.change_amount,
            reason: d.reason,
            notes: d.notes,
            adminName: d.admin_name,
            createdAt: d.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase inventory logs query error', e);
      }
    }
    return getLocalItem<InventoryLog[]>(STORAGE_KEYS.INVENTORY_LOGS, []);
  },

  async recordInventoryLog(logPayload: Omit<InventoryLog, 'id' | 'createdAt'>): Promise<InventoryLog> {
    const log: InventoryLog = {
      ...logPayload,
      id: `inv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('inventory_logs').insert({
          id: log.id,
          product_id: log.productId,
          product_name: log.productName,
          sku: log.sku,
          previous_stock: log.previousStock,
          new_stock: log.newStock,
          change_amount: log.changeAmount,
          reason: log.reason,
          notes: log.notes,
          admin_name: log.adminName,
          created_at: log.createdAt,
        });
      } catch (e) {
        console.warn('Supabase inventory log insert error', e);
      }
    }

    const current = getLocalItem<InventoryLog[]>(STORAGE_KEYS.INVENTORY_LOGS, []);
    current.unshift(log);
    setLocalItem(STORAGE_KEYS.INVENTORY_LOGS, current);
    return log;
  },

  async adjustStock(
    productId: string, 
    newStock: number, 
    reason: InventoryLog['reason'], 
    notes?: string, 
    adminName = 'Admin'
  ): Promise<Product | null> {
    const product = await this.getProductById(productId);
    if (!product) return null;

    const previousStock = product.stockQuantity;
    const cleanNewStock = Math.max(0, Math.floor(newStock));
    const change = cleanNewStock - previousStock;

    product.stockQuantity = cleanNewStock;
    product.isAvailable = cleanNewStock > 0 && product.status === 'published';
    await this.saveProduct(product);

    await this.recordInventoryLog({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      previousStock,
      newStock: cleanNewStock,
      changeAmount: change,
      reason,
      notes: notes || `Manual stock update (${change > 0 ? '+' : ''}${change})`,
      adminName,
    });

    return product;
  },

  // ==========================================
  // CATEGORIES & OCCASIONS
  // ==========================================
  async getCategories(): Promise<CategoryItem[]> {
    const defaultCats: CategoryItem[] = OCCASIONS_LIST.map((item, idx) => ({
      id: `cat_${item.slug}`,
      slug: item.slug,
      name: item.name,
      description: item.description,
      icon: item.icon,
      isActive: true,
      sortOrder: idx,
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data && data.length > 0) {
          return data.map((d: any, idx: number) => ({
            id: d.id,
            slug: d.slug,
            name: d.name,
            description: d.description || '',
            isActive: true,
            sortOrder: idx,
          }));
        }
      } catch (e) {
        console.warn('Supabase categories query error', e);
      }
    }

    return getLocalItem<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, defaultCats);
  },

  async saveCategory(cat: CategoryItem): Promise<CategoryItem> {
    const categories = await this.getCategories();
    const idx = categories.findIndex(c => c.slug === cat.slug || c.id === cat.id);
    if (idx !== -1) {
      categories[idx] = cat;
    } else {
      categories.push(cat);
    }
    setLocalItem(STORAGE_KEYS.CATEGORIES, categories);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').upsert({
          id: cat.id.startsWith('cat_') ? undefined : cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
        });
      } catch (e) {
        console.warn('Supabase category upsert error', e);
      }
    }

    return cat;
  },

  async deleteCategory(idOrSlug: string): Promise<boolean> {
    const categories = await this.getCategories();
    const updated = categories.filter(c => c.id !== idOrSlug && c.slug !== idOrSlug);
    setLocalItem(STORAGE_KEYS.CATEGORIES, updated);
    return true;
  },

  // ==========================================
  // COUPONS & DISCOUNTS
  // ==========================================
  async getCoupons(): Promise<Coupon[]> {
    const defaultCoupons: Coupon[] = [
      {
        id: 'cpn_welcome',
        code: 'GIFTNAO10',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 1000,
        maxDiscount: 300,
        usageLimit: 100,
        timesUsed: 14,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cpn_anniversary',
        code: 'LOVE200',
        discountType: 'fixed',
        discountValue: 200,
        minPurchase: 2000,
        usageLimit: 50,
        timesUsed: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    ];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            code: d.code,
            discountType: d.discount_type,
            discountValue: Number(d.discount_value),
            minPurchase: Number(d.min_purchase || 0),
            maxDiscount: d.max_discount ? Number(d.max_discount) : undefined,
            expiryDate: d.expiry_date,
            usageLimit: d.usage_limit,
            timesUsed: d.times_used || 0,
            isActive: Boolean(d.is_active),
            createdAt: d.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase coupons query error', e);
      }
    }

    return getLocalItem<Coupon[]>(STORAGE_KEYS.COUPONS, defaultCoupons);
  },

  async saveCoupon(coupon: Coupon): Promise<Coupon> {
    const coupons = await this.getCoupons();
    const idx = coupons.findIndex(c => c.id === coupon.id || c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx !== -1) {
      coupons[idx] = coupon;
    } else {
      coupons.unshift(coupon);
    }
    setLocalItem(STORAGE_KEYS.COUPONS, coupons);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('coupons').upsert({
          id: coupon.id.startsWith('cpn_') ? undefined : coupon.id,
          code: coupon.code.toUpperCase(),
          discount_type: coupon.discountType,
          discount_value: coupon.discountValue,
          min_purchase: coupon.minPurchase,
          max_discount: coupon.maxDiscount,
          expiry_date: coupon.expiryDate,
          usage_limit: coupon.usageLimit,
          times_used: coupon.timesUsed,
          is_active: coupon.isActive,
        });
      } catch (e) {
        console.warn('Supabase coupon upsert error', e);
      }
    }

    return coupon;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const coupons = await this.getCoupons();
    const updated = coupons.filter(c => c.id !== id);
    setLocalItem(STORAGE_KEYS.COUPONS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('coupons').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase coupon delete error', e);
      }
    }

    return true;
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
    const coupons = await this.getCoupons();
    const match = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!match) {
      return { valid: false, discount: 0, message: 'Invalid coupon code.' };
    }
    if (!match.isActive) {
      return { valid: false, discount: 0, message: 'This coupon is no longer active.' };
    }
    if (match.expiryDate && new Date(match.expiryDate) < new Date()) {
      return { valid: false, discount: 0, message: 'This coupon has expired.' };
    }
    if (subtotal < match.minPurchase) {
      return { valid: false, discount: 0, message: `Minimum purchase of ৳${match.minPurchase.toLocaleString()} required for this coupon.` };
    }
    if (match.usageLimit && match.timesUsed >= match.usageLimit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit has been reached.' };
    }

    let calculatedDiscount = 0;
    if (match.discountType === 'percentage') {
      calculatedDiscount = Math.round((subtotal * match.discountValue) / 100);
      if (match.maxDiscount && calculatedDiscount > match.maxDiscount) {
        calculatedDiscount = match.maxDiscount;
      }
    } else {
      calculatedDiscount = match.discountValue;
    }

    return {
      valid: true,
      discount: Math.min(calculatedDiscount, subtotal),
      message: `Coupon applied: ৳${calculatedDiscount} discount!`,
    };
  },

  // ==========================================
  // IMAGE STORAGE HELPER
  // ==========================================
  async uploadProductImage(file: File): Promise<{ url: string; error?: string }> {
    // Validate file size (max 5MB) & format
    if (!file.type.startsWith('image/')) {
      return { url: '', error: 'Only image files (JPG, PNG, WebP) are permitted.' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { url: '', error: 'Image size must be under 5MB.' };
    }

    // Try Supabase Storage first
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `catalog/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            return { url: publicUrlData.publicUrl };
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload error, falling back to local object preview', err);
      }
    }

    // Resilient local fallback: Convert to Data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: '', error: 'Failed to read image file.' });
      };
      reader.readAsDataURL(file);
    });
  },

  // ==========================================
  // ADMIN DASHBOARD KPI METRICS
  // ==========================================
  async getAdminMetrics() {
    const orders = await this.getAllOrders();
    const products = await this.getProducts(true);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    // Rule: Exclude cancelled or unpaid orders from sales calculations
    const isCompletedSale = (o: Order) =>
      (o.paymentStatus === 'paid' || o.paymentStatus === 'cod_collected' || o.orderStatus === 'delivered') &&
      o.orderStatus !== 'cancelled';

    const completedOrders = orders.filter(isCompletedSale);

    const salesToday = completedOrders
      .filter(o => new Date(o.createdAt).getTime() >= todayStart)
      .reduce((sum, o) => sum + o.finalTotal, 0);

    const salesLast7Days = completedOrders
      .filter(o => new Date(o.createdAt).getTime() >= sevenDaysAgo)
      .reduce((sum, o) => sum + o.finalTotal, 0);

    const salesLast30Days = completedOrders
      .filter(o => new Date(o.createdAt).getTime() >= thirtyDaysAgo)
      .reduce((sum, o) => sum + o.finalTotal, 0);

    const totalSales = completedOrders.reduce((sum, o) => sum + o.finalTotal, 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'pending_confirmation').length;
    const processingOrders = orders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'ready_for_dispatch').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
    const awaitingPayments = orders.filter(o => o.paymentStatus === 'awaiting_verification').length;

    const lowStockThreshold = 10;
    const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || lowStockThreshold)).length;
    const outOfStockCount = products.filter(p => p.stockQuantity <= 0).length;

    return {
      totalOrders: orders.length,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      awaitingPayments,
      salesToday,
      salesLast7Days,
      salesLast30Days,
      totalSales,
      lowStockCount,
      outOfStockCount,
      totalProducts: products.length,
      publishedProducts: products.filter(p => p.status === 'published').length,
      draftProducts: products.filter(p => p.status === 'draft').length,
      archivedProducts: products.filter(p => p.status === 'archived').length,
    };
  },

  // ==========================================
  // ORDERS MANAGEMENT
  // ==========================================
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orderNumber = `GN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    
    const newOrder: Order = {
      ...orderPayload,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ord_${Date.now()}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          customer_email: newOrder.customerEmail,
          recipient_name: newOrder.recipientName,
          recipient_phone: newOrder.recipientPhone,
          is_surprise_gift: newOrder.isSurpriseGift,
          district: newOrder.district,
          area: newOrder.area,
          delivery_address: newOrder.deliveryAddress,
          address_instructions: newOrder.addressInstructions,
          gift_message: newOrder.giftMessage,
          subtotal: newOrder.subtotal,
          shipping_charge: newOrder.shippingCharge,
          discount: newOrder.discount || 0,
          final_total: newOrder.finalTotal,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.orderStatus,
        };

        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .insert([dbPayload])
          .select()
          .single();

        if (!orderErr && orderData) {
          if (newOrder.items && newOrder.items.length > 0) {
            const dbItems = newOrder.items.map((it) => ({
              order_id: newOrder.id,
              product_id: it.productId,
              product_name: it.productName,
              product_slug: it.productSlug,
              unit_price: it.unitPrice,
              quantity: it.quantity,
              subtotal: it.subtotal,
              variant_name: it.variantName,
              personalization_text: it.personalizationText,
            }));
            await supabase.from('order_items').insert(dbItems);
          }
        }
      } catch (e) {
        console.warn('Supabase order creation error, saving locally', e);
      }
    }

    // Deduct inventory safely
    for (const item of newOrder.items) {
      const product = await this.getProductById(item.productId);
      if (product && product.trackStock !== false) {
        const updatedStock = Math.max(0, product.stockQuantity - item.quantity);
        await this.adjustStock(
          product.id,
          updatedStock,
          'order_fulfillment',
          `Order fulfillment for #${newOrder.orderNumber}`,
          'System'
        );
      }
    }

    const currentOrders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    currentOrders.unshift(newOrder);
    setLocalItem(STORAGE_KEYS.ORDERS, currentOrders);

    return newOrder;
  },

  async getOrderByIdOrTracking(reference: string, phoneVerification?: string): Promise<Order | null> {
    const cleanRef = reference.trim().toUpperCase();
    const cleanPhone = phoneVerification ? phoneVerification.replace(/\D/g, '') : null;

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('orders').select('*, order_items(*)').or(`order_number.eq.${cleanRef},id.eq.${cleanRef}`);
        if (cleanPhone) {
          query = query.or(`customer_phone.ilike.%${cleanPhone}%,recipient_phone.ilike.%${cleanPhone}%`);
        }
        const { data, error } = await query.maybeSingle();
        if (!error && data) return mapDbOrder(data);
      } catch (e) {
        console.warn('Supabase tracking query error', e);
      }
    }

    const currentOrders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const found = currentOrders.find(
      (o) => o.orderNumber.toUpperCase() === cleanRef || o.id === cleanRef
    );

    if (!found) return null;

    if (cleanPhone) {
      const custPhone = found.customerPhone.replace(/\D/g, '');
      const recipPhone = found.recipientPhone.replace(/\D/g, '');
      if (!custPhone.includes(cleanPhone) && !recipPhone.includes(cleanPhone)) {
        return null;
      }
    }

    return found;
  },

  async submitPaymentTransaction(orderNumber: string, transactionId: string, paymentPhone: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({
            transaction_id: transactionId,
            payment_phone: paymentPhone,
            payment_status: 'awaiting_verification',
            payment_submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('order_number', orderNumber);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase transaction submit error', e);
      }
    }

    const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (idx !== -1) {
      orders[idx].transactionId = transactionId;
      orders[idx].paymentPhone = paymentPhone;
      orders[idx].paymentStatus = 'awaiting_verification';
      orders[idx].paymentSubmittedAt = new Date().toISOString();
      orders[idx].updatedAt = new Date().toISOString();
      setLocalItem(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  },

  async getAllOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        if (!error && data) return data.map(mapDbOrder);
      } catch (e) {
        console.warn('Supabase getAllOrders error', e);
      }
    }
    return getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.id === orderId);
    
    // Restock inventory if order is cancelled
    if (status === 'cancelled' && idx !== -1 && orders[idx].orderStatus !== 'cancelled') {
      for (const item of orders[idx].items) {
        const product = await this.getProductById(item.productId);
        if (product && product.trackStock !== false) {
          await this.adjustStock(
            product.id,
            product.stockQuantity + item.quantity,
            'order_cancellation',
            `Restored from cancelled Order #${orders[idx].orderNumber}`,
            'System'
          );
        }
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ order_status: status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase updateOrderStatus error', e);
      }
    }

    if (idx !== -1) {
      orders[idx].orderStatus = status;
      orders[idx].updatedAt = new Date().toISOString();
      setLocalItem(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  },

  async verifyPayment(orderId: string, isApproved: boolean): Promise<boolean> {
    const newStatus: PaymentStatus = isApproved ? 'paid' : 'failed';
    const newOrderStatus: OrderStatus = isApproved ? 'confirmed' : 'pending_confirmation';

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: newStatus,
            order_status: newOrderStatus,
            payment_verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase verifyPayment error', e);
      }
    }

    const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx].paymentStatus = newStatus;
      if (isApproved && orders[idx].orderStatus === 'pending_confirmation') {
        orders[idx].orderStatus = 'confirmed';
      }
      orders[idx].paymentVerifiedAt = new Date().toISOString();
      orders[idx].updatedAt = new Date().toISOString();
      setLocalItem(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  },

  // ==========================================
  // STORE SETTINGS
  // ==========================================
  async getStoreSettings(): Promise<StoreSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).maybeSingle();
        if (!error && data) {
          return {
            storeName: data.store_name || DEFAULT_STORE_SETTINGS.storeName,
            phone: data.phone || DEFAULT_STORE_SETTINGS.phone,
            whatsapp: data.whatsapp || DEFAULT_STORE_SETTINGS.whatsapp,
            email: data.email || DEFAULT_STORE_SETTINGS.email,
            address: data.address || DEFAULT_STORE_SETTINGS.address,
            facebookUrl: data.facebook_url || DEFAULT_STORE_SETTINGS.facebookUrl,
            instagramUrl: data.instagram_url || DEFAULT_STORE_SETTINGS.instagramUrl,
            businessHours: data.business_hours || DEFAULT_STORE_SETTINGS.businessHours,
            insideDhakaShipping: Number(data.inside_dhaka_shipping ?? DEFAULT_STORE_SETTINGS.insideDhakaShipping),
            outsideDhakaShipping: Number(data.outside_dhaka_shipping ?? DEFAULT_STORE_SETTINGS.outsideDhakaShipping),
            announcementText: data.announcement_text || DEFAULT_STORE_SETTINGS.announcementText,
            bkashNumber: data.bkash_number || DEFAULT_STORE_SETTINGS.bkashNumber,
            bkashType: data.bkash_type || DEFAULT_STORE_SETTINGS.bkashType,
            nagadNumber: data.nagad_number || DEFAULT_STORE_SETTINGS.nagadNumber,
            nagadType: data.nagad_type || DEFAULT_STORE_SETTINGS.nagadType,
            rocketNumber: data.rocket_number || DEFAULT_STORE_SETTINGS.rocketNumber,
            rocketType: data.rocket_type || DEFAULT_STORE_SETTINGS.rocketType,
          };
        }
      } catch (e) {
        console.warn('Supabase settings query error', e);
      }
    }
    return getLocalItem<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_STORE_SETTINGS);
  },

  async updateStoreSettings(newSettings: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getStoreSettings();
    const updated = { ...current, ...newSettings };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('store_settings').upsert({
          id: 1,
          store_name: updated.storeName,
          phone: updated.phone,
          whatsapp: updated.whatsapp,
          email: updated.email,
          address: updated.address,
          facebook_url: updated.facebookUrl,
          instagram_url: updated.instagramUrl,
          business_hours: updated.businessHours,
          inside_dhaka_shipping: updated.insideDhakaShipping,
          outside_dhaka_shipping: updated.outsideDhakaShipping,
          announcement_text: updated.announcementText,
          bkash_number: updated.bkashNumber,
          bkash_type: updated.bkashType,
          nagad_number: updated.nagadNumber,
          nagad_type: updated.nagadType,
          rocket_number: updated.rocketNumber,
          rocket_type: updated.rocketType,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Supabase settings upsert error', e);
      }
    }

    setLocalItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },
};
