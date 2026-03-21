// src/app/account/orders/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Download, FileText } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export const metadata = { title: 'My Orders' }

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        download_tokens (token, expires_at, download_count, max_downloads)
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-white text-xs font-mono tracking-widest uppercase mb-2">Account</p>
          <h1 className="font-display text-4xl font-bold text-white">My Orders</h1>
        </div>

        {!orders?.length ? (
          <div className="card-dark p-12 text-center">
            <p className="text-zinc-500 mb-4">No orders yet.</p>
            <Link href="/shop" className="btn-blue px-6 py-3 inline-flex">Browse Beats</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card-dark overflow-hidden">
                {/* Order header */}
                <div className="px-6 py-4 border-b border-zinc-850 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-zinc-500">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-display font-bold">${order.total.toFixed(2)}</p>
                    <span className="text-[10px] text-green-400 font-mono uppercase">Paid</span>
                  </div>
                </div>

                {/* Order items */}
                <div className="divide-y divide-zinc-900">
                  {order.order_items?.map((item: any) => {
                    const token = item.download_tokens?.[0]
                    const isExpired = token && new Date(token.expires_at) < new Date()
                    const maxed = token && token.download_count >= token.max_downloads

                    return (
                      <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-white text-sm">{item.beat_title}</p>
                          <p className="text-white text-xs mt-0.5">{item.license_label}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {token && !isExpired && !maxed ? (
                            <a
                              href={`/api/download/${token.token}`}
                              className="flex items-center gap-1.5 btn-blue px-3 py-1.5 text-xs"
                            >
                              <Download className="w-3 h-3" />
                              Download ({token.max_downloads - token.download_count} left)
                            </a>
                          ) : (
                            <span className="text-xs text-zinc-600 font-mono">
                              {isExpired ? 'Link expired' : maxed ? 'Limit reached' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
