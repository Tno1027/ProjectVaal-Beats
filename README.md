# Sovereign Beats — Beat Store

Full-stack beat marketplace. Next.js 14 + Supabase + Stripe.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payments | Stripe Checkout |
| State | Zustand (cart + player) |
| Audio | Howler.js |
| Fonts | Playfair Display + DM Sans |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create Supabase project
- Go to https://supabase.com → New project
- Copy your Project URL and anon key

### 3. Run database schema
- Go to Supabase → SQL Editor
- Paste and run `supabase/schema.sql`

### 4. Create Storage buckets
In Supabase dashboard → Storage, create:
- `beat-previews` — **Public** (watermarked MP3s)
- `beat-covers` — **Public** (cover artwork)
- `beat-files` — **Private** (full stems/WAVs)
- `license-docs` — **Private** (license PDFs)

### 5. Set up Stripe
- Create account at https://stripe.com
- Get publishable + secret keys from Dashboard
- Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
  - Events to listen: `checkout.session.completed`, `payment_intent.payment_failed`

### 6. Environment variables
```bash
cp .env.local.example .env.local
```
Fill in all values.

### 7. Run dev server
```bash
npm run dev
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── shop/page.tsx         # Beat catalog
│   ├── beat/[slug]/page.tsx  # Beat detail
│   ├── checkout/page.tsx     # Checkout
│   ├── checkout/success/     # Order confirmed
│   ├── account/orders/       # User orders
│   ├── admin/page.tsx        # Admin dashboard
│   ├── licensing/page.tsx    # License info
│   └── api/
│       ├── checkout/         # Create Stripe session
│       ├── webhooks/stripe/  # Handle Stripe events
│       ├── download/[token]/ # Secure file delivery
│       └── beats/[id]/play/  # Play count tracking
├── components/
│   ├── layout/               # Navbar, Providers
│   ├── beats/                # BeatCard, ShopFilters, BeatDetailClient
│   ├── player/               # StickyPlayer
│   └── checkout/             # CartDrawer
├── lib/
│   ├── supabase/             # Client + server Supabase instances
│   ├── stripe.ts             # Stripe utilities
│   ├── beats.ts              # Beat data access layer
│   ├── license-tiers.ts      # Default license config
│   └── store/
│       ├── cart.ts           # Zustand cart store
│       └── player.ts         # Zustand player store
└── types/index.ts            # All TypeScript types
```

---

## Adding Beats (Admin)

1. Upload preview MP3 (watermarked) to `beat-previews` bucket
2. Upload cover art to `beat-covers` bucket
3. Upload full files (WAV, stems) to `beat-files/{beat_id}/{tier}/`
4. Insert beat record into `beats` table
5. Insert license records into `licenses` table

Or use the admin UI at `/admin/beats/new`.

---

## Deployment (Vercel)

```bash
vercel deploy
```

Add all environment variables in Vercel dashboard.
Update Stripe webhook URL to your production domain.

---

## License Tiers (Default Pricing)

| Tier | Price (AUD) | Key Right |
|------|-------------|-----------|
| Basic (MP3) | $29.99 | 50K streams, non-exclusive |
| Premium (WAV) | $49.99 | 150K streams |
| Trackout (Stems) | $99.99 | 500K + Content ID |
| Unlimited | $149.99 | Unlimited everything |
| Exclusive | $499.99 | Full copyright, beat retired |

Prices are per-beat overridable in the `licenses` table.

---

## Next Steps

- [ ] Beat upload admin UI (`/admin/beats/new`)
- [ ] Order management admin UI (`/admin/orders`)
- [ ] Email delivery (Resend / SendGrid integration)
- [ ] License PDF generation (per order)
- [ ] Wishlist functionality
- [ ] Custom beat request form
- [ ] Coupon/discount system
- [ ] Analytics dashboard
- [ ] Blog/SEO content section
