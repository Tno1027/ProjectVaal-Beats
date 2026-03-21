// src/lib/store/player.ts
import { create } from 'zustand'
import type { Beat } from '@/types'

interface PlayerState {
  currentBeat: Beat | null
  queue: Beat[]
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLoading: boolean
  // Actions
  play: (beat: Beat, queue?: Beat[]) => void
  pause: () => void
  resume: () => void
  stop: () => void
  nextTrack: () => void
  prevTrack: () => void
  setVolume: (vol: number) => void
  toggleMute: () => void
  setCurrentTime: (time: number) => void
  setDuration: (dur: number) => void
  setLoading: (loading: boolean) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentBeat: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isLoading: false,

  play: (beat, queue) => {
    const q = queue || [beat]
    set({
      currentBeat: beat,
      queue: q,
      isPlaying: true,
      currentTime: 0,
      isLoading: true,
    })
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  stop: () => set({ currentBeat: null, isPlaying: false, currentTime: 0 }),

  nextTrack: () => {
    const { currentBeat, queue } = get()
    if (!currentBeat || queue.length === 0) return
    const currentIndex = queue.findIndex(b => b.id === currentBeat.id)
    const nextIndex = (currentIndex + 1) % queue.length
    set({ currentBeat: queue[nextIndex], isPlaying: true, currentTime: 0 })
  },

  prevTrack: () => {
    const { currentBeat, queue } = get()
    if (!currentBeat || queue.length === 0) return
    const currentIndex = queue.findIndex(b => b.id === currentBeat.id)
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length
    set({ currentBeat: queue[prevIndex], isPlaying: true, currentTime: 0 })
  },

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setLoading: (isLoading) => set({ isLoading }),
}))
