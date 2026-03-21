// src/lib/store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Beat, CartItem, License } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (beat: Beat, license: License) => void
  removeItem: (beatId: string, licenseId: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
  hasItem: (beatId: string, licenseTier: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (beat, license) => {
        const existing = get().items.find(
          i => i.beat.id === beat.id && i.license.tier === license.tier
        )
        if (existing) return

        set(state => ({
          items: [...state.items, { beat, license, quantity: 1 }],
          isOpen: true,
        }))
      },

      removeItem: (beatId, licenseTier) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.beat.id === beatId && i.license.tier === licenseTier)
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce((sum, item) => sum + item.license.price, 0),

      itemCount: () => get().items.length,

      hasItem: (beatId, licenseTier) =>
        get().items.some(
          i => i.beat.id === beatId && i.license.tier === licenseTier
        ),
    }),
    {
      name: 'sovereign-cart',
      // Don't persist isOpen state
      partialize: state => ({ items: state.items }),
    }
  )
)
