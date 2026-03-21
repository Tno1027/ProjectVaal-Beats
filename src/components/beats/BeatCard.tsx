'use client'
// src/components/beats/BeatCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, ShoppingCart, Heart } from 'lucide-react'
import { usePlayerStore } from '@/lib/store/player'
import { useCartStore } from '@/lib/store/cart'
import type { Beat } from '@/types'
import { clsx } from 'clsx'

interface BeatCardProps {
  beat: Beat
  queue?: Beat[]
  variant?: 'default' | 'compact'
}

export function BeatCard({ beat, queue, variant = 'default' }: BeatCardProps) {
  const { currentBeat, isPlaying, play, pause } = usePlayerStore()
  const { addItem, hasItem } = useCartStore()

  const isCurrentlyPlaying = currentBeat?.id === beat.id && isPlaying
  const isInCart = beat.licenses?.[0] && hasItem(beat.id, beat.licenses[0].tier)

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isCurrentlyPlaying) {
      pause()
    } else {
      play(beat, queue || [beat])
    }
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!beat.licenses?.length) return
    // Default: add cheapest license
    const cheapest = [...beat.licenses].sort((a, b) => a.price - b.price)[0]
    addItem(beat, cheapest)
  }

  return (
    <Link href={`/beat/${beat.slug}`} className="group block">
      <div
        className={clsx(
          'relative card-dark hover-blue-border overflow-hidden transition-all duration-300',
          'hover:translate-y-[-2px]',
          currentBeat?.id === beat.id && 'border-blue-500/40 shadow-blue-sm'
        )}
      >
        {/* Cover Art */}
        <div className={clsx('relative overflow-hidden', variant === 'compact' ? 'h-40' : 'h-52')}>
          {beat.cover_art_url ? (
            <Image
              src={beat.cover_art_url}
              alt={beat.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-zinc-850 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-dim flex items-center justify-center">
                <span className="text-white text-2xl font-display">♪</span>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-200/90 via-transparent to-transparent" />

          {/* Play button */}
          <button
            onClick={handlePlayToggle}
            className={clsx(
              'absolute bottom-3 left-3 w-10 h-10 rounded-full flex items-center justify-center',
              'transition-all duration-200',
              isCurrentlyPlaying
                ? 'bg-blue-500 text-dark-400 scale-100'
                : 'bg-dark-100/80 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
            )}
          >
            {isCurrentlyPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      height: `${[60, 100, 70, 90, 55][i]}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Exclusive badge */}
          {beat.is_exclusive_sold ? (
            <span className="absolute top-2 right-2 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900/80 text-zinc-500 border border-zinc-800">
              EXCLUSIVE SOLD
            </span>
          ) : beat.licenses?.some(l => l.is_exclusive) && (
            <span className="absolute top-2 right-2 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-dim text-white border border-blue-500/30">
              EXCL AVAIL
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-sm text-white line-clamp-1 group-hover:text-white transition-colors">
              {beat.title}
            </h3>
            <button
              onClick={(e) => { e.preventDefault(); /* wishlist */ }}
              className="text-zinc-600 hover:text-white transition-colors flex-shrink-0"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900">
              {beat.bpm} BPM
            </span>
            <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900">
              {beat.key}
            </span>
            {beat.genre?.[0] && (
              <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900">
                {beat.genre[0]}
              </span>
            )}
          </div>

          {/* Price + Add */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500">from </span>
              <span className="text-white font-display font-bold text-base">
                ${beat.min_price?.toFixed(2) ?? '—'}
              </span>
            </div>
            <button
              onClick={handleQuickAdd}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                isInCart
                  ? 'bg-blue-500/20 text-white border border-blue-500/40'
                  : 'bg-zinc-850 text-zinc-300 hover:bg-blue-dim hover:text-white border border-zinc-800 hover:border-blue-500/30'
              )}
            >
              <ShoppingCart className="w-3 h-3" />
              {isInCart ? 'In Cart' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
