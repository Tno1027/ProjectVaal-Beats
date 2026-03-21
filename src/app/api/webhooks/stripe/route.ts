// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[webhook] signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status !== 'paid') break

      const meta = session.metadata!
      const items = JSON.parse(meta.items || '[]')

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: meta.user_id || null,
          guest_email: meta.guest_email || null,
          subtotal: (session.amount_subtotal || 0) / 100,
          total: (session.amount_total || 0) / 100,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_session_id: session.id,
          status: 'paid',
        })
        .select()
        .single()

      if (orderError) {
        console.error('[webhook] order creation failed:', orderError)
        break
      }

      // Create order items + download tokens
      for (const item of items) {
        const { data: orderItem } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            beat_id: item.beat_id,
            beat_title: item.beat_title,
            license_tier: item.license_tier,
            license_label: item.license_label,
            price: item.price,
          })
          .select()
          .single()

        if (orderItem) {
          // Create download token (72hr expiry, 5 downloads max)
          await supabase.from('download_tokens').insert({
            order_item_id: orderItem.id,
            token: nanoid(32),
            expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
            max_downloads: 5,
          })
        }

        // If exclusive — lock the beat
        if (item.license_tier === 'exclusive') {
          await supabase
            .from('beats')
            .update({ is_exclusive_sold: true })
            .eq('id', item.beat_id)
        }
      }

      // TODO: Send order confirmation email here
      console.log(`[webhook] Order ${order.id} created successfully`)
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('stripe_payment_intent_id', pi.id)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
