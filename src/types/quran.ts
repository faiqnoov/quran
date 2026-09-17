/** Types matching the live EQuran.id v2 API responses. */

/** Standard API envelope wrapping every endpoint's payload. */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** Surah metadata returned by GET /surat (list) and as part of surah detail. */
export interface SurahMeta {
  nomor: number
  nama: string // Arabic name
  namaLatin: string // e.g. "Al-Baqarah"
  jumlahAyat: number
  tempatTurun: string // "Mekah" | "Madinah"
  arti: string // Indonesian meaning
  deskripsi: string // contains raw HTML
  audioFull: Record<string, string> // keyed "01"–"06"
}

/**
 * Reduced surah reference used in suratSelanjutnya / suratSebelumnya.
 * The API returns only a subset of SurahMeta fields for adjacent surahs.
 */
export interface SurahNav {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
}

/** A single ayah within a surah detail response. */
export interface Ayah {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  audio: Record<string, string> // keyed "01"–"06"
}

/** Full surah detail returned by GET /surat/{nomor}. */
export interface SurahDetail extends SurahMeta {
  ayat: Ayah[]
  suratSelanjutnya: SurahNav | false
  suratSebelumnya: SurahNav | false
}

/** A single tafsir entry for an ayah. */
export interface TafsirAyah {
  ayat: number
  teks: string // tafsir text (may contain HTML)
}

/** Tafsir response from GET /tafsir/{nomor}. */
export interface TafsirDetail {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: string
  arti: string
  deskripsi: string
  audioFull: Record<string, string>
  tafsir: TafsirAyah[]
}
