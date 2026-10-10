import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { HomePage } from "@/pages/Home"
import { SurahDetailPage } from "@/pages/SurahDetail"
import { SearchPage } from "@/pages/Search"
import { BookmarksPage } from "@/pages/Bookmarks"
import { NotFoundPage } from "@/pages/NotFound"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: TWENTY_FOUR_HOURS,
      retry: 2,
    },
  },
})

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="surah/:nomor" element={<SurahDetailPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="bookmarks" element={<BookmarksPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-center" />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
