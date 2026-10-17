import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type ArabicFontSize = 'sm' | 'md' | 'lg'
export type ReadingMode = 'ayah' | 'mushaf'

interface SettingsState {
  theme: Theme
  arabicFontSize: ArabicFontSize
  showLatin: boolean
  showTranslation: boolean
  readingMode: ReadingMode
  setTheme: (theme: Theme) => void
  setArabicFontSize: (size: ArabicFontSize) => void
  setShowLatin: (show: boolean) => void
  setShowTranslation: (show: boolean) => void
  setReadingMode: (mode: ReadingMode) => void
}

const VALID_THEMES: Theme[] = ['light', 'dark', 'system']
const VALID_FONT_SIZES: ArabicFontSize[] = ['sm', 'md', 'lg']
const VALID_READING_MODES: ReadingMode[] = ['ayah', 'mushaf']

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      arabicFontSize: 'md',
      showLatin: true,
      showTranslation: true,
      readingMode: 'ayah',

      setTheme: (theme) => set({ theme }),
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setShowLatin: (show) => set({ showLatin: show }),
      setShowTranslation: (show) => set({ showTranslation: show }),
      setReadingMode: (mode) => set({ readingMode: mode }),
    }),
    {
      name: 'quran-settings',
      version: 1,
      merge: (persisted, current) => {
        const state = persisted as Partial<SettingsState> | undefined

        return {
          ...current,
          theme:
            state?.theme && VALID_THEMES.includes(state.theme)
              ? state.theme
              : current.theme,
          arabicFontSize:
            state?.arabicFontSize &&
            VALID_FONT_SIZES.includes(state.arabicFontSize)
              ? state.arabicFontSize
              : current.arabicFontSize,
          showLatin:
            typeof state?.showLatin === 'boolean'
              ? state.showLatin
              : current.showLatin,
          showTranslation:
            typeof state?.showTranslation === 'boolean'
              ? state.showTranslation
              : current.showTranslation,
          readingMode:
            state?.readingMode &&
            VALID_READING_MODES.includes(state.readingMode)
              ? state.readingMode
              : current.readingMode,
        }
      },
    },
  ),
)

