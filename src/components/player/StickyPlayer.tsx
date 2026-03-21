'use client'
// src/components/player/StickyPlayer.tsx
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import { usePlayerStore } from '@/lib/store/player'
import { useCartStore } from '@/lib/store/cart'
import { ShoppingCart } from 'lucide-react'
import { clsx } from 'clsx'

export function StickyPlayer() {
  const {
    currentBeat, isPlaying, currentTime, duration,
    volume, isMuted, isLoading,
    pause, resume, stop, nextTrack, prevTrack,
    setVolume, toggleMute, setCurrentTime, setDuration, setLoading,
  } = usePlayerStore()

  const { addItem, hasItem } = useCartStore()
  const howlerRef = useRef<any>(null)
  const seekingRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('howler').then(({ Howl }) => {
      if (howlerRef.current) {
        howlerRef.current.unload()
        howlerRef.current = null
      }

      if (!currentBeat?.preview_url) return

      howlerRef.current = new Howl({
        src: [currentBeat.preview_url],
        html5: true,
        volume: isMuted ? 0 : volume,
        onload: () => {
          setDuration(howlerRef.current.duration())
          setLoading(false)
        },
        onplay: () => {
          const update = () => {
            if (howlerRef.current && !seekingRef.current) {
              setCurrentTime(howlerRef.current.seek() as number)
            }
            if (howlerRef.current?.playing()) requestAnimationFrame(update)
          }
          requestAnimationFrame(update)
        },
        onend: () => nextTrack(),
        onloaderror: () => setLoading(false),
      })

      if (isPlaying) howlerRef.current.play()

      // Track play count
      fetch(`/api/beats/${currentBeat.id}/play`, { method: 'POST' }).catch(() => {})
    })

    return () => {
      howlerRef.current?.unload()
    }
  }, [currentBeat?.id])

  useEffect(() => {
    if (!howlerRef.current) return
    if (isPlaying) howlerRef.current.play()
    else howlerRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    if (howlerRef.current) {
      howlerRef.current.volume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    seekingRef.current = false
    setCurrentTime(time)
    howlerRef.current?.seek(time)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (!currentBeat) return null

  const cheapestLicense = currentBeat.licenses?.sort((a, b) => a.price - b.price)[0]
  const inCart = cheapestLicense && hasItem(currentBeat.id, cheapestLicense.tier)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-850 bg-dark-100/95 backdrop-blur-xl">
      {/* Progress bar — full width at top */}
      <div className="relative h-0.5 bg-zinc-850">
        <div
          className="absolute left-0 top-0 h-full bg-blue-gradient transition-all"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          step={0.1}
          onChange={handleSeek}
          onMouseDown={() => { seekingRef.current = true }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Beat info */}
        <div className="flex items-center gap-3 w-56 min-w-0">
          <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-zinc-850">
            {currentBeat.cover_art_url ? (
              <Image src={currentBeat.cover_art_url} alt={currentBeat.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">♪</div>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-dark-200/70 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentBeat.title}</p>
            <p className="text-[11px] text-zinc-500">{currentBeat.bpm} BPM · {currentBeat.key}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <button onClick={prevTrack} className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={isPlaying ? pause : resume}
            className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-400 text-dark-400 flex items-center justify-center transition-all hover:scale-105 shadow-blue-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
          </button>
          <button onClick={nextTrack} className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Time */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-500 w-24 justify-center">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggleMute} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-blue-500 cursor-pointer"
          />
        </div>

        {/* CTA */}
        {cheapestLicense && (
          <button
            onClick={() => !inCart && addItem(currentBeat, cheapestLicense)}
            className={clsx(
              'hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all',
              inCart
                ? 'text-white border border-blue-500/40 bg-blue-dim'
                : 'btn-blue'
            )}
          >
            <ShoppingCart className="w-3 h-3" />
            {inCart ? 'In Cart' : `$${cheapestLicense.price}`}
          </button>
        )}

        {/* Close */}
        <button onClick={stop} className="p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
