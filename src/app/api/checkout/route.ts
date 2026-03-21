// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, guestEmail }: { items: CartItem[]; guestEmail?: string } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Get user if logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const session = await createCheckoutSession({
      items,
      userId: user?.id,
      guestEmail: guestEmail || user?.email,
      successUrl: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/cart`,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err: any) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
