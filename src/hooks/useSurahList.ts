import { useQuery } from "@tanstack/react-query"
import { getSurahList, getCachedSurahList } from "@/api/quran"
import type { SurahMeta } from "@/types/quran"

/**
 * Fetches the list of all 114 surahs. Data is treated as immutable
 * (staleTime: Infinity from the global QueryClient config), so a
 * second mount will serve from cache without refetching.
 *
 * Provides placeholderData from localStorage so cached data renders
 * immediately while verifying with the network. Falls back to cached
 * copy when the API fails.
 */
export function useSurahList() {
  return useQuery<SurahMeta[]>({
    queryKey: ["surahs"],
    queryFn: getSurahList,
    placeholderData: () => getCachedSurahList() ?? undefined,
  })
}
