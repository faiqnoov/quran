import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Bookmark {
  surahNumber: number
  surahName: string
  ayahNumber: number
  snippet: string
  createdAt: number
}

interface BookmarkState {
  bookmarks: Bookmark[]
  toggleBookmark: (bookmark: Omit<Bookmark, 'createdAt'>) => void
  removeBookmark: (surahNumber: number, ayahNumber: number) => void
  hasBookmark: (surahNumber: number, ayahNumber: number) => boolean
  clearAll: () => void
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      toggleBookmark: (bookmark) => {
        const { bookmarks } = get()
        const exists = bookmarks.some(
          (b) =>
            b.surahNumber === bookmark.surahNumber &&
            b.ayahNumber === bookmark.ayahNumber,
        )

        if (exists) {
          set({
            bookmarks: bookmarks.filter(
              (b) =>
                !(
                  b.surahNumber === bookmark.surahNumber &&
                  b.ayahNumber === bookmark.ayahNumber
                ),
            ),
          })
        } else {
          set({
            bookmarks: [
              ...bookmarks,
              { ...bookmark, createdAt: Date.now() },
            ],
          })
        }
      },

      removeBookmark: (surahNumber, ayahNumber) => {
        set({
          bookmarks: get().bookmarks.filter(
            (b) =>
              !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber),
          ),
        })
      },

      hasBookmark: (surahNumber, ayahNumber) => {
        return get().bookmarks.some(
          (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber,
        )
      },

      clearAll: () => set({ bookmarks: [] }),
    }),
    {
      name: 'quran-bookmarks',
      version: 1,
      // If persisted data is malformed or from an older version,
      // merge safely with defaults so the app never crashes.
      merge: (persisted, current) => {
        const state = persisted as Partial<BookmarkState> | undefined
        return {
          ...current,
          bookmarks: Array.isArray(state?.bookmarks) ? state.bookmarks : [],
        }
      },
    },
  ),
)
