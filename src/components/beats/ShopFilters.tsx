'use client'
// src/components/beats/ShopFilters.tsx
import { useRouter, usePathname } from 'next/navigation'
import { Filter, ChevronDown } from 'lucide-react'
import type { BeatFilter } from '@/types'
import { useState } from 'react'
import { clsx } from 'clsx'
import { Socials } from '@/components/layout/Socials'

const GENRES = ['Trap', 'Drill', 'Afrobeats', 'R&B', 'Pop', 'Cinematic', 'Lo-Fi', 'Gospel']
const MOODS  = ['Dark', 'Melodic', 'Aggressive', 'Chill', 'Hype', 'Romantic', 'Epic']
const KEYS   = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Played' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

interface ShopFiltersProps {
  currentFilter: BeatFilter
}

export function ShopFilters({ currentFilter }: ShopFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState({ genre: true, mood: false, key: false, bpm: false })

  const updateFilter = (key: keyof BeatFilter, value: any) => {
    const params = new URLSearchParams()

    const next = { ...currentFilter, [key]: value || undefined }
    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v))
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAll = () => router.push(pathname)

  const hasActive = Object.values(currentFilter).some(v => v !== undefined && v !== '' && v !== 'newest')

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Filter className="w-3.5 h-3.5 text-white" />
          Filters
        </div>
        {hasActive && (
          <button
            onClick={clearAll}
            className="text-xs text-zinc-600 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-5">
        <label className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">Sort</label>
        <select
          value={currentFilter.sort || 'newest'}
          onChange={e => updateFilter('sort', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Genre */}
      <FilterSection
        label="Genre"
        expanded={expanded.genre}
        onToggle={() => setExpanded(e => ({ ...e, genre: !e.genre }))}
      >
        <div className="flex flex-wrap gap-1.5">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => updateFilter('genre', currentFilter.genre === g.toLowerCase() ? undefined : g.toLowerCase())}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                currentFilter.genre === g.toLowerCase()
                  ? 'bg-blue-500/20 text-white border border-blue-500/40'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Mood */}
      <FilterSection
        label="Mood"
        expanded={expanded.mood}
        onToggle={() => setExpanded(e => ({ ...e, mood: !e.mood }))}
      >
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => updateFilter('mood', currentFilter.mood === m.toLowerCase() ? undefined : m.toLowerCase())}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                currentFilter.mood === m.toLowerCase()
                  ? 'bg-blue-500/20 text-white border border-blue-500/40'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Key */}
      <FilterSection
        label="Key"
        expanded={expanded.key}
        onToggle={() => setExpanded(e => ({ ...e, key: !e.key }))}
      >
        <div className="flex flex-wrap gap-1">
          {KEYS.map(k => (
            <button
              key={k}
              onClick={() => updateFilter('key', currentFilter.key === k ? undefined : k)}
              className={clsx(
                'w-9 h-8 rounded text-[11px] font-mono font-medium transition-all',
                currentFilter.key === k
                  ? 'bg-blue-500/20 text-white border border-blue-500/40'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* BPM */}
      <FilterSection
        label="BPM"
        expanded={expanded.bpm}
        onToggle={() => setExpanded(e => ({ ...e, bpm: !e.bpm }))}
      >
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentFilter.bpm_min}
            onBlur={e => updateFilter('bpm_min', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentFilter.bpm_max}
            onBlur={e => updateFilter('bpm_max', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </FilterSection>

      {/* Exclusive toggle */}
      <div className="flex items-center justify-between py-3 border-t border-zinc-900 mt-2">
        <span className="text-xs text-zinc-400">Exclusive Available</span>
        <button
          onClick={() => updateFilter('exclusive_available', !currentFilter.exclusive_available)}
          className={clsx(
            'w-10 h-5 rounded-full transition-all duration-300 relative',
            currentFilter.exclusive_available ? 'bg-blue-500' : 'bg-zinc-800'
          )}
        >
          <span className={clsx(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300',
            currentFilter.exclusive_available ? 'translate-x-5' : 'translate-x-0.5'
          )} />
        </button>
      </div>

      {/* Socials */}
      <div className="pt-6 mt-2 border-t border-zinc-900">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Follow</p>
        <Socials layout="row" />
      </div>
    </div>
  )
}

function FilterSection({
  label, expanded, onToggle, children
}: {
  label: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-zinc-900 py-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-xs font-mono text-zinc-500 uppercase tracking-widest mb-0"
      >
        {label}
        <ChevronDown className={clsx('w-3 h-3 transition-transform', expanded && 'rotate-180')} />
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  )
}
