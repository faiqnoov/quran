import { useQuery } from "@tanstack/react-query"
import { getSurahList } from "@/api/quran"
import type { SurahMeta } from "@/types/quran"

/**
 * Fetches the list of all 114 surahs. Data is treated as immutable
 * (staleTime: Infinity from the global QueryClient config), so a
 * second mount will serve from cache without refetching.
 */
export function useSurahList() {
  return useQuery<SurahMeta[]>({
    queryKey: ["surahs"],
    queryFn: getSurahList,
  })
}
