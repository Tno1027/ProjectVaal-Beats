// src/app/beat/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getBeatBySlug, getRelatedBeats } from '@/lib/beats'
import { BeatDetailClient } from '@/components/beats/BeatDetailClient'
import { BeatCard } from '@/components/beats/BeatCard'
import type { Metadata } from 'next'

interface BeatPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BeatPageProps): Promise<Metadata> {
  const beat = await getBeatBySlug(params.slug).catch(() => null)
  if (!beat) return { title: 'Beat Not Found' }

  return {
    title: beat.title,
    description: beat.description || `License "${beat.title}" — ${beat.bpm} BPM, Key of ${beat.key}`,
    openGraph: {
      images: beat.cover_art_url ? [beat.cover_art_url] : [],
    },
  }
}

export default async function BeatPage({ params }: BeatPageProps) {
  const beat = await getBeatBySlug(params.slug).catch(() => null)
  if (!beat) notFound()

  const related = await getRelatedBeats(beat).catch(() => [])

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back */}
        <a href="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors">
          ← Back to shop
        </a>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Cover Art */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 shadow-card">
              {beat.cover_art_url ? (
                <Image
                  src={beat.cover_art_url}
                  alt={beat.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-8xl">♪</span>
                </div>
              )}
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-400/50 to-transparent" />
            </div>

            {/* Tags below cover */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                {beat.bpm} BPM
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                Key: {beat.key}
              </span>
              {beat.genre?.map(g => (
                <span key={g} className="px-3 py-1 rounded-full text-xs font-mono bg-blue-dim border border-blue-500/20 text-white">
                  {g}
                </span>
              ))}
              {beat.mood?.map(m => (
                <span key={m} className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-500">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Detail + Purchase — client component handles interactivity */}
          <BeatDetailClient beat={beat} />
        </div>

        {/* Related beats */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(b => (
                <BeatCard key={b.id} beat={b} queue={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
