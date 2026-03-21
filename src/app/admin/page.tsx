// src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Music, ShoppingBag, Users, TrendingUp, Upload, Settings } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  // Stats
  const [beatsCount, ordersCount, customersCount, revenue] = await Promise.all([
    supabase.from('beats').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'paid'),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
    supabase.from('orders').select('total').eq('status', 'paid'),
  ])

  const totalRevenue = revenue.data?.reduce((s, o) => s + Number(o.total), 0) || 0

  const STATS = [
    { icon: Music, label: 'Active Beats', value: beatsCount.count || 0, color: 'text-white' },
    { icon: ShoppingBag, label: 'Total Orders', value: ordersCount.count || 0, color: 'text-green-400' },
    { icon: Users, label: 'Customers', value: customersCount.count || 0, color: 'text-purple-400' },
    { icon: TrendingUp, label: 'Revenue (AUD)', value: `$${totalRevenue.toFixed(2)}`, color: 'text-white' },
  ]

  const QUICK_ACTIONS = [
    { icon: Upload, label: 'Upload Beat', href: '/admin/beats/new', desc: 'Add a new beat to catalog' },
    { icon: ShoppingBag, label: 'View Orders', href: '/admin/orders', desc: 'Manage all orders' },
    { icon: Music, label: 'Manage Beats', href: '/admin/beats', desc: 'Edit, deactivate beats' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', desc: 'Store configuration' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-white text-xs font-mono tracking-widest uppercase mb-2">Admin</p>
          <h1 className="font-display text-4xl font-bold text-white">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card-dark p-5">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <p className="font-display font-bold text-2xl text-white">{value}</p>
              <p className="text-zinc-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <h2 className="font-display text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(({ icon: Icon, label, href, desc }) => (
            <Link key={href} href={href} className="card-dark p-5 hover-blue-border group">
              <Icon className="w-5 h-5 text-white mb-3" />
              <p className="font-medium text-white text-sm mb-1">{label}</p>
              <p className="text-zinc-600 text-xs">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
