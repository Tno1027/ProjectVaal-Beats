// src/types/index.ts

export type LicenseTier = 'mp3' | 'wav' | 'trackout' | 'unlimited' | 'exclusive'

export interface License {
  tier: LicenseTier
  label: string
  price: number
  files: string[]
  streams: string
  distribution: string
  monetization: string
  credit: string
  content_id: boolean
  exclusive: boolean
  description: string
}

export interface Beat {
  id: string
  slug: string
  title: string
  cover_art_url: string
  preview_url: string
  bpm: number
  key: string
  genre: string[]
  mood: string[]
  similar_artists: string[]
  description: string
  licenses: License[]
  play_count: number
  is_exclusive_sold: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // computed
  min_price?: number
  max_price?: number
}

export interface CartItem {
  beat: Beat
  license: License
  quantity: 1
}

export interface Order {
  id: string
  user_id: string | null
  guest_email: string | null
  items: OrderItem[]
  subtotal: number
  total: number
  stripe_payment_intent_id: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  beat_id: string
  beat_title: string
  license_tier: LicenseTier
  price: number
  download_url?: string
  download_expires_at?: string
  license_id: string
  beat?: Beat
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
}

export interface BeatFilter {
  genre?: string
  mood?: string
  bpm_min?: number
  bpm_max?: number
  price_min?: number
  price_max?: number
  key?: string
  sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc'
  exclusive_available?: boolean
  search?: string
}

export interface DownloadToken {
  id: string
  order_item_id: string
  token: string
  expires_at: string
  download_count: number
  max_downloads: number
}
