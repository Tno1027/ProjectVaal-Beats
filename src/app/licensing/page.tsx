// src/app/licensing/page.tsx
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { DEFAULT_LICENSE_TIERS, LICENSE_TIER_ORDER } from '@/lib/license-tiers'

export const metadata = {
  title: 'Licensing',
  description: 'Understand our license tiers and what rights you get.',
}

const COMPARE_ROWS = [
  { label: 'Streams', key: 'streams' },
  { label: 'Distribution', key: 'distribution' },
  { label: 'Monetization', key: 'monetization' },
  { label: 'Credit Required', key: 'credit' },
  { label: 'Content ID', key: 'content_id' },
  { label: 'Exclusive Rights', key: 'is_exclusive' },
]

export default function LicensingPage() {
  const tiers = LICENSE_TIER_ORDER.map(t => ({
    tier: t,
    ...DEFAULT_LICENSE_TIERS[t],
  }))

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-white text-xs font-mono tracking-widest uppercase mb-3">Clear. Simple. Yours.</p>
          <h1 className="font-display text-5xl font-bold text-white mb-4">License Tiers</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Every beat comes with multiple licensing options. Pick the tier that matches your usage.
            All licenses come with a downloadable signed contract.
          </p>
        </div>

        {/* License cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
          {tiers.map((tier, i) => (
            <div
              key={tier.tier}
              className={`card-dark p-5 hover-blue-border relative ${
                i === 2 ? 'border-blue-500/30 shadow-blue-sm' : ''
              }`}
            >
              {i === 2 && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-500 text-dark-400 text-[10px] font-mono font-bold rounded-full uppercase tracking-wide">
                  Popular
                </span>
              )}
              <div className="mb-4">
                <p className="text-white text-[10px] font-mono uppercase tracking-widest mb-1">
                  {tier.tier}
                </p>
                <h3 className="font-display font-bold text-white text-lg">{tier.label}</h3>
                <p className="text-white font-display font-bold text-2xl mt-1">
                  ${tier.default_price}
                  <span className="text-xs text-zinc-600 font-body font-normal ml-1">AUD</span>
                </p>
              </div>

              <p className="text-zinc-500 text-xs mb-4 leading-relaxed">{tier.description}</p>

              <ul className="space-y-2">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                    <Check className="w-3 h-3 text-white mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/shop"
                className={`mt-5 block text-center text-xs font-medium py-2 rounded-lg transition-all ${
                  i === 2
                    ? 'btn-blue'
                    : 'border border-zinc-800 text-zinc-400 hover:border-blue-500/30 hover:text-white'
                }`}
              >
                Browse Beats
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="card-dark overflow-hidden mb-16">
          <div className="p-6 border-b border-zinc-850">
            <h2 className="font-display font-bold text-white text-xl">License Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-850">
                  <th className="text-left px-6 py-3 text-zinc-600 text-xs font-mono uppercase">Feature</th>
                  {tiers.map(t => (
                    <th key={t.tier} className="px-4 py-3 text-center text-xs font-mono text-white uppercase">
                      {t.tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.key} className={`border-b border-zinc-900 ${i % 2 === 0 ? 'bg-zinc-900/20' : ''}`}>
                    <td className="px-6 py-3 text-zinc-400 text-xs">{row.label}</td>
                    {tiers.map(t => {
                      const val = (t as any)[row.key]
                      return (
                        <td key={t.tier} className="px-4 py-3 text-center">
                          {typeof val === 'boolean' ? (
                            val
                              ? <Check className="w-4 h-4 text-white mx-auto" />
                              : <X className="w-4 h-4 text-zinc-700 mx-auto" />
                          ) : (
                            <span className="text-zinc-400 text-xs">{val}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'What happens after I purchase a lease?',
                a: 'Your files are delivered instantly via email. You also get a signed license agreement tied to your order. Downloads are available in your account for re-access anytime.',
              },
              {
                q: 'Can multiple artists buy the same beat?',
                a: 'Yes — non-exclusive leases can be sold to multiple artists. If you want to be the only one using it, purchase the exclusive license and the beat is retired from the store permanently.',
              },
              {
                q: 'Do I need to credit the producer?',
                a: 'For all non-exclusive tiers (Basic through Unlimited), yes — credit is required: "Prod. by Wiise-min". Exclusive licenses make credit optional.',
              },
              {
                q: 'What is Content ID?',
                a: 'Content ID allows platforms like YouTube to identify your music and route ad revenue to you. Trackout and Unlimited leases include Content ID rights. Basic and WAV do not.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="card-dark p-5">
                <h3 className="font-semibold text-white text-sm mb-2">{q}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
