export type OccasionSlug =
  | 'couple-gifts'
  | 'birthday-gifts'
  | 'anniversary-gifts'
  | 'valentines-day'
  | 'new-year'
  | 'bengali-new-year'
  | 'chocolates-sweets'
  | 'personalized-gifts';

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
  inStock: boolean;
}

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku?: string;
  shortDescription: string;
  description: string;
  price: number; // in BDT
  compareAtPrice?: number;
  costPrice?: number; // Internal admin only
  images: string[];
  category: string;
  categorySlug: OccasionSlug | string;
  occasions: string[];
  stockQuantity: number;
  lowStockThreshold?: number;
  trackStock?: boolean;
  status?: ProductStatus;
  isAvailable: boolean;
  isPersonalizable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  variants?: ProductVariant[];
  dimensions?: string;
  ingredients?: string;
  allergens?: string;
  weight?: string;
  expiryInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  reason: 'restock' | 'manual_adjustment' | 'order_fulfillment' | 'order_cancellation' | 'damage';
  notes?: string;
  adminName?: string;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  personalizationText?: string;
  giftMessage?: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';

export type PaymentStatus =
  | 'pending'
  | 'awaiting_verification'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cod_due'
  | 'cod_collected';

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'ready_for_dispatch'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  productSlug: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  variantName?: string;
  personalizationText?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. GN-2026-1001
  createdAt: string;
  updatedAt: string;
  
  // Customer info
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  
  // Recipient info
  recipientName: string;
  recipientPhone: string;
  isSurpriseGift: boolean;
  
  // Address info
  district: string;
  area: string;
  deliveryAddress: string;
  addressInstructions?: string;
  giftMessage?: string;
  
  // Financials
  items: OrderItemSnapshot[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  finalTotal: number;
  couponCode?: string;
  
  // Payment info
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentPhone?: string;
  paymentSubmittedAt?: string;
  paymentVerifiedAt?: string;
  
  // Order status & Courier
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  businessHours: string;
  insideDhakaShipping: number;
  outsideDhakaShipping: number;
  announcementText: string;
  
  // Payment instructions
  bkashNumber: string;
  bkashType: 'Merchant' | 'Personal';
  nagadNumber: string;
  nagadType: 'Merchant' | 'Personal';
  rocketNumber: string;
  rocketType: 'Merchant' | 'Personal';
}
