// src/lib/license-tiers.ts
import type { LicenseTier } from '@/types'

export const DEFAULT_LICENSE_TIERS: Record<LicenseTier, {
  label: string
  description: string
  streams: string
  distribution: string
  monetization: string
  credit: string
  content_id: boolean
  is_exclusive: boolean
  features: string[]
  default_price: number
}> = {
  mp3: {
    label: 'Basic Lease',
    description: 'MP3 download for demos, mixtapes, and non-commercial use.',
    streams: 'Up to 50,000',
    distribution: 'Up to 2,500 copies',
    monetization: 'Non-profit only',
    credit: 'Must credit "Prod. by Wiise-min"',
    content_id: false,
    is_exclusive: false,
    features: [
      'MP3 tracked-out file',
      '50K streams',
      '2,500 distribution copies',
      'Demo/mixtape use',
      'Must credit producer',
    ],
    default_price: 29.99,
  },
  wav: {
    label: 'Premium Lease',
    description: 'High-quality WAV for professional releases.',
    streams: 'Up to 150,000',
    distribution: 'Up to 5,000 copies',
    monetization: 'Profit allowed',
    credit: 'Must credit "Prod. by Wiise-min"',
    content_id: false,
    is_exclusive: false,
    features: [
      'WAV + MP3 files',
      '150K streams',
      '5,000 distribution copies',
      'Monetize on all platforms',
      'Must credit producer',
    ],
    default_price: 49.99,
  },
  trackout: {
    label: 'Trackout Lease',
    description: 'Individual stems for full mixing control.',
    streams: 'Up to 500,000',
    distribution: 'Unlimited copies',
    monetization: 'Full monetization',
    credit: 'Must credit "Prod. by Wiise-min"',
    content_id: true,
    is_exclusive: false,
    features: [
      'WAV + MP3 + Tracked Stems',
      '500K streams',
      'Unlimited distribution',
      'Content ID allowed',
      'Sync licensing allowed',
    ],
    default_price: 99.99,
  },
  unlimited: {
    label: 'Unlimited Lease',
    description: 'No stream or distribution caps. Full commercial use.',
    streams: 'Unlimited',
    distribution: 'Unlimited',
    monetization: 'Full monetization',
    credit: 'Must credit "Prod. by Wiise-min"',
    content_id: true,
    is_exclusive: false,
    features: [
      'WAV + MP3 + Tracked Stems',
      'Unlimited streams',
      'Unlimited distribution',
      'Radio & TV licensing',
      'Music video use',
    ],
    default_price: 149.99,
  },
  exclusive: {
    label: 'Exclusive Rights',
    description: 'Full ownership transfer. Beat retired from store.',
    streams: 'Unlimited',
    distribution: 'Unlimited',
    monetization: 'Full monetization',
    credit: 'Optional credit',
    content_id: true,
    is_exclusive: true,
    features: [
      'All source files + stems',
      'Full copyright transfer',
      'Producer retires beat',
      'You own it exclusively',
      'Negotiable terms',
    ],
    default_price: 499.99,
  },
}

export const LICENSE_TIER_ORDER: LicenseTier[] = [
  'mp3',
  'wav',
  'trackout',
  'unlimited',
  'exclusive',
]
