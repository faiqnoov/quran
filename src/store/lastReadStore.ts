import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LastRead {
  surahNumber: number
  surahName: string
  ayahNumber: number
  updatedAt: number
}

interface LastReadState {
  lastRead: LastRead | null
  setLastRead: (data: Omit<LastRead, 'updatedAt'>) => void
  clearLastRead: () => void
}

export const useLastReadStore = create<LastReadState>()(
  persist(
    (set) => ({
      lastRead: null,

      setLastRead: (data) =>
        set({
          lastRead: { ...data, updatedAt: Date.now() },
        }),

      clearLastRead: () => set({ lastRead: null }),
    }),
    {
      name: 'quran-last-read',
      version: 1,
      merge: (persisted, current) => {
        const state = persisted as Partial<LastReadState> | undefined
        const lr = state?.lastRead

        // Validate shape: must have all required numeric/string fields
        const isValid =
          lr != null &&
          typeof lr === 'object' &&
          typeof lr.surahNumber === 'number' &&
          typeof lr.surahName === 'string' &&
          typeof lr.ayahNumber === 'number' &&
          typeof lr.updatedAt === 'number'

        return {
          ...current,
          lastRead: isValid ? lr : null,
        }
      },
    },
  ),
)
