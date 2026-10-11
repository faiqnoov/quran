/**
 * Static Qur'anic Juz metadata (Mushaf Madinah boundaries).
 * Sourced from Tanzil.net and verified against Quran.com API.
 */

export interface JuzEntry {
  juz: number // 1–30
  startSurah: number
  startAyah: number
  endSurah: number
  endAyah: number
}

export const JUZ_DATA: readonly JuzEntry[] = [
  { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { juz: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
]

function compareAyah(s1: number, a1: number, s2: number, a2: number): number {
  if (s1 !== s2) return s1 - s2
  return a1 - a2
}

/**
 * Returns the juz number (1–30) for a given surah and ayah.
 */
export function getJuzForAyah(surah: number, ayah: number): number {
  if (
    compareAyah(surah, ayah, JUZ_DATA[0].startSurah, JUZ_DATA[0].startAyah) <= 0
  ) {
    return 1
  }
  const last = JUZ_DATA[JUZ_DATA.length - 1]
  if (compareAyah(surah, ayah, last.endSurah, last.endAyah) >= 0) {
    return 30
  }

  for (let i = 0; i < JUZ_DATA.length; i++) {
    const entry = JUZ_DATA[i]
    if (
      compareAyah(surah, ayah, entry.startSurah, entry.startAyah) >= 0 &&
      compareAyah(surah, ayah, entry.endSurah, entry.endAyah) <= 0
    ) {
      return entry.juz
    }
  }

  return 1
}

/**
 * Returns the JuzEntry metadata for a given juz number (1–30).
 */
export function getSurahsInJuz(juz: number): JuzEntry {
  const clamped = Math.max(1, Math.min(30, Math.trunc(juz || 1)))
  return JUZ_DATA[clamped - 1]
}

/**
 * Returns all surah numbers spanned by a given juz.
 */
export function getSurahNumbersInJuz(juz: number): number[] {
  const entry = getSurahsInJuz(juz)
  return Array.from(
    { length: entry.endSurah - entry.startSurah + 1 },
    (_, i) => entry.startSurah + i
  )
}
