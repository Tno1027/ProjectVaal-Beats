// src/app/shop/page.tsx
import { Suspense } from 'react'
import { getBeats } from '@/lib/beats'
import { BeatCard } from '@/components/beats/BeatCard'
import { ShopFilters } from '@/components/beats/ShopFilters'
import type { BeatFilter } from '@/types'

interface ShopPageProps {
  searchParams: {
    genre?: string
    mood?: string
    bpm_min?: string
    bpm_max?: string
    sort?: string
    exclusive?: string
    search?: string
    key?: string
  }
}

export const metadata = {
  title: 'Shop Beats',
  description: 'Browse our full catalog of premium instrumentals.',
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filter: BeatFilter = {
    genre: searchParams.genre,
    mood: searchParams.mood,
    bpm_min: searchParams.bpm_min ? parseInt(searchParams.bpm_min) : undefined,
    bpm_max: searchParams.bpm_max ? parseInt(searchParams.bpm_max) : undefined,
    sort: (searchParams.sort as BeatFilter['sort']) || 'newest',
    exclusive_available: searchParams.exclusive === 'true',
    search: searchParams.search,
    key: searchParams.key,
  }

  const beats = await getBeats(filter).catch(() => [])

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-white text-xs font-mono tracking-widest uppercase mb-2">Catalog</p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-5xl font-bold text-white">
              {filter.search
                ? `"${filter.search}"`
                : filter.genre
                ? filter.genre.charAt(0).toUpperCase() + filter.genre.slice(1)
                : 'All Beats'}
            </h1>
            <span className="text-zinc-600 text-sm font-mono">{beats.length} beats</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <ShopFilters currentFilter={filter} />
          </aside>

          {/* Beat grid */}
          <div className="flex-1">
            {beats.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                  <span className="text-zinc-700 text-2xl">♪</span>
                </div>
                <p className="text-zinc-500">No beats found for this filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {beats.map(beat => (
                  <BeatCard key={beat.id} beat={beat} queue={beats} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
