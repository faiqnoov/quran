import type { SurahMeta, SurahDetail, TafsirDetail } from "@/types/quran"
import { fetchApi } from "./client"

/** Fetch the list of all 114 surahs (metadata only, no ayahs). */
export function getSurahList(): Promise<SurahMeta[]> {
  return fetchApi<SurahMeta[]>("/surat")
}

/** Fetch a single surah's full detail including all ayahs. */
export function getSurahDetail(nomor: number): Promise<SurahDetail> {
  return fetchApi<SurahDetail>(`/surat/${nomor}`)
}

/** Fetch Kemenag tafsir for every ayah in a surah. */
export function getTafsir(nomor: number): Promise<TafsirDetail> {
  return fetchApi<TafsirDetail>(`/tafsir/${nomor}`)
}
