// src/app/checkout/success/page.tsx
import { CheckCircle, Mail, Download } from 'lucide-react'
import Link from 'next/link'
import { getCheckoutSession } from '@/lib/stripe'

interface SuccessPageProps {
  searchParams: { session_id?: string }
}

export const metadata = { title: 'Order Confirmed' }

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  let email = ''

  if (searchParams.session_id) {
    try {
      const session = await getCheckoutSession(searchParams.session_id)
      email = session.customer_details?.email || session.customer_email || ''
    } catch {}
  }

  return (
    <div className="min-h-screen pt-24 pb-32 flex items-center justify-center">
      <div className="max-w-lg w-full px-6 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-8 animate-pulse-blue">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h1 className="font-display text-4xl font-bold text-white mb-3">
          Order Confirmed
        </h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          {email ? (
            <>Download links have been sent to <span className="text-white">{email}</span>.</>
          ) : (
            'Your payment was successful. Check your email for download links.'
          )}
        </p>

        {/* Steps */}
        <div className="card-dark p-6 text-left mb-8 space-y-4">
          {[
            { icon: Mail, text: 'Check your email for download links' },
            { icon: Download, text: 'Download your files (links valid 72 hours, 5 downloads each)' },
            { icon: CheckCircle, text: 'License agreement attached to your order confirmation' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-dim flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-zinc-400 pt-1">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Link href="/account/orders" className="btn-ghost px-5 py-3">
            My Orders
          </Link>
          <Link href="/shop" className="btn-blue px-5 py-3">
            Browse More Beats
          </Link>
        </div>
      </div>
    </div>
  )
}
