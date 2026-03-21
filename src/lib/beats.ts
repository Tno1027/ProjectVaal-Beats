// src/lib/beats.ts
import { createClient } from './supabase/server'
import type { Beat, BeatFilter } from '@/types'

export async function getBeats(filter?: BeatFilter): Promise<Beat[]> {
  const supabase = await createClient()

  let query = supabase
    .from('beats')
    .select(`
      *,
      licenses (*)
    `)
    .eq('is_active', true)

  if (filter?.genre) {
    query = query.contains('genre', [filter.genre])
  }
  if (filter?.mood) {
    query = query.contains('mood', [filter.mood])
  }
  if (filter?.bpm_min) {
    query = query.gte('bpm', filter.bpm_min)
  }
  if (filter?.bpm_max) {
    query = query.lte('bpm', filter.bpm_max)
  }
  if (filter?.key) {
    query = query.eq('key', filter.key)
  }
  if (filter?.exclusive_available) {
    query = query.eq('is_exclusive_sold', false)
  }
  if (filter?.search) {
    query = query.ilike('title', `%${filter.search}%`)
  }

  // Sorting
  switch (filter?.sort) {
    case 'popular':
      query = query.order('play_count', { ascending: false })
      break
    case 'price_asc':
      // Handled client-side via min_price
      query = query.order('created_at', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) throw error

  return (data || []).map(beat => ({
    ...beat,
    min_price: Math.min(...(beat.licenses || []).map((l: any) => l.price)),
    max_price: Math.max(...(beat.licenses || []).map((l: any) => l.price)),
  }))
}

export async function getBeatBySlug(slug: string): Promise<Beat | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('beats')
    .select(`*, licenses (*)`)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null

  return {
    ...data,
    min_price: Math.min(...(data.licenses || []).map((l: any) => l.price)),
    max_price: Math.max(...(data.licenses || []).map((l: any) => l.price)),
  }
}

export async function incrementPlayCount(beatId: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_play_count', { beat_id: beatId })
}

export async function getFeaturedBeats(limit = 6): Promise<Beat[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('beats')
    .select(`*, licenses (*)`)
    .eq('is_active', true)
    .order('play_count', { ascending: false })
    .limit(limit)

  return (data || []).map(beat => ({
    ...beat,
    min_price: Math.min(...(beat.licenses || []).map((l: any) => l.price)),
  }))
}

export async function getRelatedBeats(beat: Beat, limit = 4): Promise<Beat[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('beats')
    .select(`*, licenses (*)`)
    .eq('is_active', true)
    .neq('id', beat.id)
    .overlaps('genre', beat.genre)
    .limit(limit)

  return (data || []).map(b => ({
    ...b,
    min_price: Math.min(...(b.licenses || []).map((l: any) => l.price)),
  }))
}
