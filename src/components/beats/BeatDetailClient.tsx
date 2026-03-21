'use client'
// src/components/beats/BeatDetailClient.tsx
import { useState } from 'react'
import { Play, Pause, ShoppingCart, Check, Shield, Download, Users } from 'lucide-react'
import { usePlayerStore } from '@/lib/store/player'
import { useCartStore } from '@/lib/store/cart'
import type { Beat, License } from '@/types'
import { LICENSE_TIER_ORDER } from '@/lib/license-tiers'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

interface BeatDetailClientProps {
  beat: Beat
}

export function BeatDetailClient({ beat }: BeatDetailClientProps) {
  const { currentBeat, isPlaying, play, pause } = usePlayerStore()
  const { addItem, hasItem } = useCartStore()

  const sortedLicenses = [...(beat.licenses || [])].sort(
    (a, b) => LICENSE_TIER_ORDER.indexOf(a.tier) - LICENSE_TIER_ORDER.indexOf(b.tier)
  )

  const [selected, setSelected] = useState<License>(sortedLicenses[0])
  const isCurrentlyPlaying = currentBeat?.id === beat.id && isPlaying
  const inCart = selected && hasItem(beat.id, selected.tier)

  const handlePlay = () => {
    if (isCurrentlyPlaying) pause()
    else play(beat)
  }

  const handleAddToCart = () => {
    if (!selected) return
    if (inCart) return
    addItem(beat, selected)
    toast.success(`"${beat.title}" added to cart`)
  }

  const LICENSE_PERKS: Record<string, string[]> = {
    mp3:       ['MP3 File', '50K Streams', '2.5K Copies', 'Demo Use'],
    wav:       ['WAV + MP3', '150K Streams', '5K Copies', 'Monetize'],
    trackout:  ['Stems + WAV + MP3', '500K Streams', 'Unlimited', 'Content ID'],
    unlimited: ['All Files', 'Unlimited Streams', 'Unlimited', 'Radio/TV'],
    exclusive: ['All Files + Source', 'Full Copyright', 'Beat Retired', 'Negotiable'],
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <p className="text-white text-xs font-mono tracking-widest uppercase mb-2">
          {beat.play_count.toLocaleString()} plays
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
          {beat.title}
        </h1>
        {beat.similar_artists?.length > 0 && (
          <p className="text-zinc-500 text-sm mt-2">
            Similar to: {beat.similar_artists.slice(0, 3).join(', ')}
          </p>
        )}
      </div>

      {/* Description */}
      {beat.description && (
        <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-blue-500/30 pl-4">
          {beat.description}
        </p>
      )}

      {/* Play preview button */}
      <button
        onClick={handlePlay}
        className={clsx(
          'flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 w-fit',
          isCurrentlyPlaying
            ? 'bg-blue-500/15 border-blue-500/40 text-white'
            : 'border-zinc-800 hover:border-blue-500/30 text-zinc-300 hover:text-white hover:bg-zinc-900'
        )}
      >
        <div className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center',
          isCurrentlyPlaying ? 'bg-blue-500 text-dark-400' : 'bg-zinc-800 text-white'
        )}>
          {isCurrentlyPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${[60,100,70,90,55][i]}%` }} />
              ))}
            </div>
          ) : (
            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">{isCurrentlyPlaying ? 'Now Playing' : 'Preview Beat'}</p>
          <p className="text-xs text-zinc-500">Watermarked preview</p>
        </div>
      </button>

      {/* License selector */}
      <div>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Select License</p>
        <div className="space-y-2">
          {sortedLicenses.map(license => {
            const isSelected = selected?.tier === license.tier
            const perks = LICENSE_PERKS[license.tier] || []
            const isExclusiveSold = license.is_exclusive && beat.is_exclusive_sold

            return (
              <button
                key={license.tier}
                onClick={() => !isExclusiveSold && setSelected(license)}
                disabled={isExclusiveSold}
                className={clsx(
                  'w-full text-left rounded-xl border p-4 transition-all duration-200',
                  isExclusiveSold && 'opacity-40 cursor-not-allowed',
                  isSelected
                    ? 'border-blue-500/50 bg-blue-dim shadow-blue-sm'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={clsx(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-zinc-600'
                    )}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-dark-400" />}
                    </div>
                    <span className={clsx('font-medium text-sm', isSelected ? 'text-white' : 'text-zinc-300')}>
                      {license.label}
                    </span>
                    {isExclusiveSold && (
                      <span className="text-[10px] text-zinc-600 font-mono">SOLD</span>
                    )}
                  </div>
                  <span className={clsx('font-display font-bold', isSelected ? 'text-white text-lg' : 'text-zinc-400 text-base')}>
                    ${license.price.toFixed(2)}
                  </span>
                </div>

                {/* Perks */}
                <div className="flex flex-wrap gap-1.5 ml-6">
                  {perks.map(perk => (
                    <span key={perk} className={clsx(
                      'text-[10px] font-mono px-2 py-0.5 rounded',
                      isSelected ? 'bg-blue-500/10 text-white' : 'bg-zinc-800 text-zinc-600'
                    )}>
                      {perk}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected license details */}
      {selected && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-2">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-3">License Details</p>
          {[
            ['Streams', selected.streams],
            ['Distribution', selected.distribution],
            ['Monetization', selected.monetization],
            ['Credit', selected.credit],
            ['Content ID', selected.content_id ? 'Allowed' : 'Not included'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-zinc-600">{k}</span>
              <span className="text-zinc-300 font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add to cart */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!selected || inCart}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-300',
            inCart
              ? 'bg-blue-500/15 text-white border border-blue-500/40 cursor-default'
              : 'btn-blue'
          )}
        >
          {inCart ? (
            <><Check className="w-4 h-4" /> Added to Cart</>
          ) : (
            <><ShoppingCart className="w-4 h-4" /> Add to Cart — ${selected?.price.toFixed(2)}</>
          )}
        </button>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-600">
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Secure checkout</span>
        <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Instant delivery</span>
        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> License included</span>
      </div>
    </div>
  )
}
