# GiftNao — "Gifts That Speak from the Heart" 🎁💖

A production-oriented, responsive e-commerce web application built for **GiftNao**, delivering romantic, thoughtful, and personalized gift hampers across Bangladesh.

---

## 🎨 1. Brand Identity & Colors

GiftNao was crafted from the visual reference logo with an opening gift-box emblem and hands cradling a heart:

- **Primary Burgundy:** `#720D2D`
- **Secondary Burgundy:** `#8E2947`
- **Soft Rose:** `#DDA6AE`
- **Light Blush:** `#FFF0F2`
- **Warm Cream:** `#FFF8F2`
- **Main Text:** `#422A30`
- **Borders:** `#EADDE0`

---

## 🚀 2. Technology Stack

- **Frontend:** Next.js (App Router, React 18, TypeScript)
- **Styling:** Tailwind CSS with custom romantic palette extensions
- **Icons:** Lucide React
- **Backend & Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **State Management:** React Context (Cart with quantity, personalization notes, and Wishlist) with LocalStorage persistence fallback
- **Payments:** Cash on Delivery (COD) + Manual bKash, Nagad, and Rocket workflows with Transaction ID auditing and admin verification

---

## 📁 3. Project Structure

```
giftnao/
├── public/
│   ├── giftnao-logo.jpg           # Official GiftNao logo
│   └── giftnao-logo-original.jpg  # Original high-res backup asset
├── src/
│   ├── app/
│   │   ├── page.tsx               # Polished Homepage (Hero, Occasions, Hampers, Benefits)
│   │   ├── shop/page.tsx          # Shop All with sorting & price filtering
│   │   ├── category/[slug]/       # Occasions: couple-gifts, birthday, anniversary, etc.
│   │   ├── product/[slug]/        # Detailed Product view with personalization & food compliance
│   │   ├── search/page.tsx        # Search engine with empty states & suggestions
│   │   ├── cart/page.tsx          # Full cart management
│   │   ├── checkout/page.tsx      # Bangladesh checkout (Districts, COD, bKash, Nagad, Rocket)
│   │   ├── order-confirmation/    # Order confirmation & MFS Transaction ID submission
│   │   ├── track-order/page.tsx   # Order tracking by Order # and Phone
│   │   ├── wishlist/page.tsx      # Customer wishlist
│   │   ├── account/page.tsx       # Customer portal & order history
│   │   ├── about/page.tsx         # Brand story & values
│   │   ├── contact/page.tsx       # Contact concierge & configurable placeholders
│   │   ├── faqs/page.tsx          # Frequently Asked Questions
│   │   ├── delivery-info/         # Nationwide delivery details (64 districts)
│   │   ├── returns-policy/        # Returns, Refunds & Cancellation Policy
│   │   ├── privacy-policy/        # Privacy and personalization data protection
│   │   ├── terms/page.tsx         # Legal Terms & Conditions
│   │   └── admin/                 # Protected Administrator Portal
│   │       ├── page.tsx           # Dashboard KPIs (Sales, Orders, Stock Alerts)
│   │       ├── orders/page.tsx    # Order review, TrxID verification, Courier tracking
│   │       ├── products/page.tsx  # Product catalog manager (Create, Edit, Delete)
│   │       └── settings/page.tsx  # Store contact & MFS account configuration
│   ├── components/                # Reusable UI (Navbar, Footer, Logo, ProductCard, CartDrawer)
│   ├── context/                   # CartContext & WishlistContext
│   └── lib/                       # Types, Sample Catalog, StoreService, Supabase client
└── supabase/
    ├── migrations/20261029_initial_schema.sql # Complete DB schema, constraints, RLS policies
    └── seed.sql                   # Sample seed hampers and categories
```

---

## 💻 4. Running the Website Locally

1. Open PowerShell or Terminal in the project root:
   ```bash
   cd "C:\Users\UESR\.gemini\antigravity\scratch\giftnao"
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

To run a production build:
```bash
npm run build
npm start
```

---

## 🗄️ 5. Supabase Setup & Connection Guide

GiftNao is engineered with a **resilient hybrid data layer**:
- Out of the box, it operates seamlessly with local storage persistence and sample catalog data.
- Connecting your real Supabase instance takes only a few minutes:

### Step 1: Create a Supabase Project
1. Visit [supabase.com](https://supabase.com) and create an account.
2. Click **New Project**, choose an organization, set a project name (e.g. `giftnao-db`), and select Singapore as the region for optimal latency to Bangladesh.

### Step 2: Apply Database Schema & Policies
1. In the Supabase Dashboard, open **SQL Editor**.
2. Copy the entire contents of `supabase/migrations/20261029_initial_schema.sql` and run it. This creates:
   - Tables (`products`, `orders`, `order_items`, `store_settings`, `user_roles`)
   - Numeric constraints and triggers
   - Full Row Level Security (RLS) policies protecting customer data
3. Next, copy the contents of `supabase/seed.sql` and run it to populate initial hampers.

### Step 3: Configure Environment Variables
1. In your Supabase Project, navigate to **Project Settings** -> **API**.
2. Copy the **Project URL** and the **anon (public)** key.
3. In your project root, create `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart your Next.js server (`npm run dev`). The application will now query your live PostgreSQL database!

---

## 🛡️ 6. Establishing the First Administrator Safely

To ensure security, public user signups never automatically grant administrator privileges.

1. Have your administrator sign up on the site at `/account` using their business email.
2. In Supabase Dashboard, go to **Authentication** -> **Users** and copy their `User UID`.
3. In **SQL Editor**, run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('<PASTE-USER-UID-HERE>', 'admin');
   ```
4. The user can now access the full administrative capabilities at `/admin`.

---

## 💳 7. Configuring Payments (COD & Mobile Banking)

Navigate to `/admin/settings`:
1. **Cash on Delivery (COD):** Set delivery charges (default ৳70 inside Dhaka, ৳130 outside Dhaka).
2. **bKash:** Set your receiving phone number and designate whether it is **Personal** (Send Money) or **Merchant** (Make Payment).
3. **Nagad & Rocket:** Set your designated receiving numbers and account types.

### Manual Verification Workflow:
- Customer completes order and receives the instructions.
- Customer sends payment and inputs their Transaction ID (TrxID) and sender phone number.
- Administrator opens `/admin/orders`, reviews the matching SMS/statement on their phone, and clicks **Approve Payment & Confirm Order**.
- Payment status transitions to **Paid** and order transitions to **Confirmed**.

---

## 🚀 8. Deploying to Vercel

1. Push your code to a GitHub or GitLab repository.
2. Go to [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
3. Import your GiftNao repository.
4. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Click **Deploy**. Vercel will build and assign your live domain!

---

## 📝 9. Business Information Checklist (To Provide Before Launch)

Replace the following placeholder values in `/admin/settings` or `.env`:
- `[YOUR_BUSINESS_PHONE]` — Official hotline phone number
- `[YOUR_WHATSAPP_NUMBER]` — WhatsApp concierge desk number
- `[YOUR_BUSINESS_EMAIL]` — Customer support email
- `[YOUR_VERIFIED_BUSINESS_ADDRESS]` — Physical office or fulfillment address
- `[YOUR_FACEBOOK_URL]` — Official Facebook page URL
- `[YOUR_INSTAGRAM_URL]` — Official Instagram handle
- `[YOUR_BUSINESS_HOURS]` — Active customer service hours (e.g., 9:00 AM – 10:00 PM)
- Actual courier merchant agreements (Steadfast, Pathao, RedX, eCourier)
