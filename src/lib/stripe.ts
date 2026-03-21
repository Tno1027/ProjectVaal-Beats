// src/lib/stripe.ts
import Stripe from 'stripe'
import type { CartItem } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function createCheckoutSession({
  items,
  userId,
  guestEmail,
  couponCode,
  successUrl,
  cancelUrl,
}: {
  items: CartItem[]
  userId?: string
  guestEmail?: string
  couponCode?: string
  successUrl: string
  cancelUrl: string
}) {
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'aud',
      product_data: {
        name: `${item.beat.title} — ${item.license.label}`,
        description: item.license.description,
        images: item.beat.cover_art_url ? [item.beat.cover_art_url] : [],
        metadata: {
          beat_id: item.beat.id,
          beat_slug: item.beat.slug,
          license_tier: item.license.tier,
        },
      },
      unit_amount: Math.round(item.license.price * 100), // cents
    },
    quantity: 1,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: guestEmail,
    metadata: {
      user_id: userId || '',
      guest_email: guestEmail || '',
      items: JSON.stringify(
        items.map(i => ({
          beat_id: i.beat.id,
          beat_title: i.beat.title,
          beat_slug: i.beat.slug,
          license_tier: i.license.tier,
          license_label: i.license.label,
          price: i.license.price,
        }))
      ),
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    automatic_tax: { enabled: false }, // enable if using Stripe Tax
  })

  return session
}

export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'line_items'],
  })
}
