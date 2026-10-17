# TASKS-PHASE2.md — Phase 2 Execution Breakdown

> Companion to `PLAN.md`. Continues from Phase 1 (`TASKS.md`).
> Work top to bottom; each task depends on the ones above it.

## Working Agreement

Carry forward all rules from Phase 1's `TASKS.md`:
- One task at a time. Finish acceptance criteria before starting the next.
- `pnpm build` must pass with zero TypeScript errors after each task.
- Conventional-commit recommendation after each task.
- Stop and report if assumptions are wrong.
- Never modify preset theme tokens or `src/components/ui/` files unless explicitly stated.

---

## T6 — Juz & Mushaf-Page Navigation ⭐ (Priority)

> The EQuran.id v2 API has **no juz endpoint**. Juz/page boundaries are static
> Qur'anic metadata and must be embedded as a client-side data map.
>
> This feature is **not just navigation** — it introduces a second **reading mode**:
> a **Mushaf Page View** that renders continuous flowing Arabic text per page
> (like a physical Qur'an), in addition to the existing ayah-list view.
> Tapping an ayah in mushaf mode opens a bottom sheet with actions.

### Reference UI (from screenshots)

| Element | Description |
|---------|-------------|
| **Page header** | Shows "Halaman {n}" + "Juz {n}". Tabs for adjacent surahs on the current page. |
| **Surah banner** | Surah Arabic name (ornamental), revelation place, ayah count — appears when a surah starts on this page. |
| **Bismillah** | Rendered before surah text (except surah 1 & 9), matching mushaf style. |
| **Arabic body** | Continuous RTL flowing text for the entire page. Ayah end-markers (circled numbers like ﴿١﴾) are **inline** within the text — no line breaks per ayah. |
| **Ayah tap target** | Each ayah's text span is tappable. Tapping highlights the ayah and opens a bottom sheet. |
| **Bottom sheet** | Shows "QS. {Surah} {N}: Ayat {M}" + action list: Putar Murottal, Lihat Terjemahan, Bagikan Ayat, Salin Ayat, Tambah ke Bookmark, Tandai Terakhir Baca. |
| **View toggle** | Icon button in header to switch between ayah-list view and mushaf-page view. |

---

- [x] **T6.1 Static juz & page data**
  - Create `src/data/juz.ts` exporting a typed array of all 30 juz entries:
    ```ts
    export interface JuzEntry {
      juz: number           // 1–30
      startSurah: number
      startAyah: number
      endSurah: number
      endAyah: number
    }
    ```
  - Create `src/data/pages.ts` exporting a typed array of all 604 mushaf pages:
    ```ts
    export interface MushafPage {
      page: number           // 1–604
      startSurah: number
      startAyah: number
      endSurah: number
      endAyah: number
    }
    ```
  - **Source the data** from a trusted reference (e.g. Mushaf Madinah page/juz boundaries). Cross-check at least juz 1, 15, and 30 against a physical mushaf or well-known app.
  - Add helper functions:
    - `getJuzForAyah(surah: number, ayah: number): number`
    - `getPageForAyah(surah: number, ayah: number): number`
    - `getSurahsInJuz(juz: number): JuzEntry`
    - `getAyahsInPage(page: number): MushafPage`
    - `getJuzForPage(page: number): number`
    - `getSurahsOnPage(page: number): number[]` — returns surah numbers present on this page (a page can span 2+ surahs)
  - **Acceptance:** all functions are typed, unit-tested (at least boundary cases — first/last juz, first/last page, mid-surah page breaks, pages spanning multiple surahs). `pnpm build` clean.

- [x] **T6.2 Reading mode store & view toggle**
  - Add `readingMode: 'ayah' | 'mushaf'` to `settingsStore` (persisted).
  - Create a toggle button (icon-based, show list/page icons) in the surah detail header area.
  - When mode is `'ayah'`: render the existing `AyahItem` list (current behavior, unchanged).
  - When mode is `'mushaf'`: render the new `MushafPageView` (built in T6.4).
  - **Acceptance:** toggle switches modes instantly; preference persists across sessions and navigation; default is `'ayah'` (existing behavior).

- [x] **T6.3 `MushafPageView` component — continuous Arabic text**
  - Create `src/components/mushaf/MushafPageView.tsx`.
  - Given a mushaf page number, fetch the required surah detail(s) for that page. A single page may contain ayahs from 1–3 surahs (use `getSurahsOnPage` + parallel `getSurahDetail` calls).
  - Render the Arabic text as **continuous flowing RTL paragraph(s)**, not one block per ayah. Ayahs are separated only by inline end-markers (e.g. `﴿١﴾` using U+FD3E / U+FD3F ornamental parentheses or a styled `<span>`).
  - Each ayah's text is wrapped in a tappable `<span>` with a unique ID for tap targeting.
  - If a new surah begins mid-page: render a surah header banner (Arabic name, ornamental frame) and bismillah (except surah 1 & 9) **inline within the page flow**.
  - Arabic font size respects the existing `arabicFontSize` setting.
  - Latin and Indonesian translation are **not** shown inline in mushaf mode (they appear in the bottom sheet on tap).
  - **Acceptance:** continuous text flows naturally like a physical mushaf; ayah markers are inline; no translation/latin clutter; surah boundaries mid-page render a visual separator; text is never truncated; RTL is correct throughout.

- [ ] **T6.4 Mushaf page header & page-level navigation**
  - Create `src/components/mushaf/MushafPageHeader.tsx`.
  - Header shows: "Halaman {page}" (primary), "Juz {juz}" (secondary).
  - If the page contains ayahs from multiple surahs, show tabs or a horizontal list of surah names at the top.
  - Below the header: surah info banner — Arabic name in ornamental frame, revelation place ("Mekah"/"Madinah"), ayah count.
  - Add prev/next page arrows (swipe gesture support is a nice-to-have, not required).
  - **Acceptance:** header info is accurate for every page; multi-surah pages show all surah names; prev/next navigate correctly; page 1 hides "previous", page 604 hides "next".

- [ ] **T6.5 Mushaf ayah bottom sheet**
  - Create `src/components/mushaf/MushafAyahSheet.tsx` using shadcn `sheet` (or `drawer` on mobile).
  - Triggered when tapping an ayah span in the `MushafPageView`.
  - Sheet header: "QS. {Surah Latin Name} {surahNumber}: Ayat {ayahNumber}".
  - Action list (each as a row with icon + label):
    - **Lihat Terjemahan** — shows Indonesian translation + latin transliteration inline in the sheet
    - **Salin Ayat** — copies Arabic + translation + reference (reuse existing copy logic)
    - **Tambah ke Bookmark** / **Hapus Bookmark** — toggle bookmark (reuse `bookmarkStore`)
    - **Tandai Terakhir Baca** — sets last-read to this ayah (reuse `lastReadStore`)
    - *(Placeholders for Phase 2 features added later: Putar Murottal → T8, Bagikan Ayat → T11)*
  - The tapped ayah should be visually highlighted in the mushaf text while the sheet is open.
  - **Acceptance:** sheet opens with correct ayah info; all actions work and give toast feedback; highlighted ayah is visually distinct; sheet is dismissible by swipe-down or backdrop tap; accessible via keyboard.

- [ ] **T6.6 Juz list page**
  - Create `/juz` route and `JuzListPage`.
  - Display all 30 juz as cards. Each card shows: juz number, starting surah:ayah – ending surah:ayah, surah names spanned.
  - The surah names come from the cached `['surahs']` list (already prefetched on mount).
  - Tapping a juz card navigates to `/juz/:number`.
  - **Acceptance:** all 30 juz displayed; card info matches the Mushaf Madinah; loading/error/empty states handled; responsive at 360/768/1280 px.

- [ ] **T6.7 Juz detail page**
  - Create `/juz/:number` route and `JuzDetailPage`.
  - Fetch all surah details that belong to this juz (may span multiple surahs). Use existing `getSurahDetail()` — fetch each relevant surah in parallel.
  - Supports both reading modes:
    - **Ayah mode:** render only the ayahs within the juz range. Reuse `AyahItem`, `BismillahHeader`, and `SurahHeader`.
    - **Mushaf mode:** render the mushaf pages belonging to this juz in sequence, using `MushafPageView` per page with page-break dividers between them.
  - Show a juz header with juz number and the surah span.
  - Add prev/next juz navigation (hide "previous" on juz 1, "next" on juz 30).
  - **Acceptance:** ayahs match the official juz boundaries exactly; partial surahs render correctly (e.g. juz 1 ends mid-Al-Baqarah); all Phase 1 ayah features work in ayah mode; mushaf mode pages are correct; reading mode toggle works within juz view.

- [ ] **T6.8 Mushaf page view on surah detail**
  - On `/surah/:nomor`, when reading mode is `'mushaf'`, render the surah as a sequence of mushaf pages (using `MushafPageView` per page).
  - The first page shown is the page containing ayah 1 of the surah. If the surah starts mid-page, only show ayahs from this surah on that first page.
  - Support `?ayat=n` deep-link: scroll to and highlight the correct page/ayah.
  - **Acceptance:** all surah ayahs are rendered across the correct mushaf pages; deep-link works in mushaf mode; switching between ayah/mushaf mode preserves scroll position approximately.

- [ ] **T6.9 Juz & page indicators on ayah-list view**
  - In the ayah-list view (existing), show:
    - Mushaf page number as a subtle badge/divider whenever the page changes between consecutive ayahs.
    - Juz divider/badge when the juz boundary changes within a surah.
  - Update the surah header to show the juz range (e.g. "Juz 1–3" for Al-Baqarah).
  - **Acceptance:** page-break and juz-break markers appear at the correct ayahs; unobtrusive; do not break RTL layout.

- [ ] **T6.10 Quick-jump navigation**
  - Add a "Go to" popover/dialog accessible from the navbar or a FAB that allows jumping by:
    - Juz number (1–30) → navigates to `/juz/:number`
    - Mushaf page number (1–604) → navigates to the correct surah+page in mushaf mode
    - Surah:Ayah (reuse existing `"2:255"` search syntax) → navigates to `/surah/:nomor?ayat=n`
  - Each option navigates to the correct page/route with the correct ayah scroll target.
  - **Acceptance:** all three jump modes work; input is validated (out-of-range shows inline error); accessible via keyboard.

- [ ] **T6.11 Navigation integration**
  - Add a "Juz" tab/link to the main navbar alongside the existing surah list.
  - On the Home page, add a tab or toggle to switch between "Surah" view and "Juz" view.
  - **Acceptance:** switching between views is seamless; active state is visually clear; mobile bottom-nav layout still fits at 360 px.

---

## T7 — Tafsir per Ayah

- [ ] **T7.1 `useTafsir` hook**
  - TanStack Query hook on key `['tafsir', nomor]` calling `getTafsir(nomor)`.
  - The hook is lazy — only fetched when a user requests tafsir, not on surah load.
  - **Acceptance:** returns typed `TafsirDetail`; cache key aligns with existing conventions.

- [ ] **T7.2 Tafsir panel on `AyahItem`**
  - Add a "Tafsir" button to the per-ayah action row (alongside bookmark and copy).
  - Tapping opens a collapsible panel or shadcn `sheet` below the ayah showing the tafsir text.
  - Tafsir text may contain HTML → sanitize before rendering (strip dangerous tags, keep basic formatting).
  - Show loading skeleton while the tafsir API call is in flight (first request for that surah).
  - **Acceptance:** tafsir text matches the Kemenag tafsir for the ayah; HTML is sanitized; panel is scrollable for long tafsir entries; only one panel open at a time (opening another closes the previous).

- [ ] **T7.3 Standalone tafsir view**
  - Support `/surah/:nomor/tafsir` route that shows the full tafsir for every ayah in the surah, interleaved with the Arabic text.
  - Link to this view from the surah header.
  - **Acceptance:** all ayah tafsirs rendered; page title includes "Tafsir" + surah name; back-navigation works.

---

## T8 — Murottal Audio Player

> Audio URLs are already in the API response (`ayah.audio` and `surahMeta.audioFull`).
> Never preload all ayahs' audio. Load lazily, one at a time.

- [ ] **T8.1 `audioPlayerStore` (Zustand)**
  - Persist selected reciter only (not playback position).
  - State shape:
    ```ts
    interface AudioPlayerState {
      isPlaying: boolean
      currentSurah: number | null
      currentAyah: number | null    // null = full-surah mode
      reciter: string               // "01"–"06", default "05" (Misyari)
      playbackMode: 'ayah' | 'surah'
      // actions
      play: (surah: number, ayah?: number) => void
      pause: () => void
      stop: () => void
      setReciter: (id: string) => void
      nextAyah: () => void
      prevAyah: () => void
    }
    ```
  - **Acceptance:** store is typed, reciter persists across reload, play/pause/stop actions update state correctly.

- [ ] **T8.2 `useAudioPlayer` hook**
  - Manages the `HTMLAudioElement` lifecycle. Loads audio URL from the ayah/surah data.
  - Handles: play, pause, stop, seek, autoplay-to-next-ayah (in ayah mode).
  - On audio `ended` event in ayah mode: auto-advance to the next ayah; stop after the last ayah of the surah.
  - Lazy loading: create the `Audio` object only when play is triggered, not on mount.
  - **Acceptance:** audio plays, pauses, resumes; autoplay advances correctly; no memory leaks from orphaned Audio objects; errors (e.g. 404 audio URL) are caught and surfaced.

- [ ] **T8.3 Per-ayah play button**
  - Add a play/pause icon button to the `AyahItem` action row.
  - When playing, the button shows a pause icon and the ayah gets a subtle "now playing" visual indicator.
  - Tapping play on a different ayah stops the current one and starts the new one.
  - **Acceptance:** only one ayah plays at a time; visual feedback is clear; button has `aria-label`.

- [ ] **T8.4 Sticky mini-player**
  - A fixed-bottom bar (above the mobile navbar) that appears when audio is playing.
  - Shows: surah name, ayah number, play/pause, prev/next ayah, progress bar, close/stop button.
  - Tapping the surah name navigates to that surah+ayah.
  - The mini-player must not block content — add bottom padding to the main content area when visible.
  - **Acceptance:** mini-player appears/hides correctly; progress bar updates in real time; controls work; responsive at 360 px; does not overlap navbar or content.

- [ ] **T8.5 Reciter picker**
  - A dropdown/select in the mini-player or in the settings sheet.
  - Lists all 6 reciters with their names (from PLAN.md §4).
  - Changing the reciter while playing restarts the current ayah with the new reciter's audio.
  - **Acceptance:** all 6 reciters selectable; switching mid-playback works; selection persists.

- [ ] **T8.6 Full-surah audio mode**
  - A "Play full surah" button on the `SurahHeader`.
  - Uses `surahMeta.audioFull[reciter]` URL.
  - Mini-player shows surah-level info (no prev/next ayah, just play/pause/stop + progress).
  - **Acceptance:** full-surah audio plays; switching between ayah mode and surah mode is seamless; progress bar works.

---

## T9 — PWA & Offline Reading

- [ ] **T9.1 Install `vite-plugin-pwa`**
  - Add `vite-plugin-pwa` to the project. Configure with `registerType: 'prompt'` so the user is notified of updates.
  - Generate the web manifest with app name ("Qur'an Digital"), icons, theme color, and `display: standalone`.
  - **Acceptance:** `pnpm build` produces a `manifest.webmanifest` and service worker; dev server still works.

- [ ] **T9.2 App icons & splash**
  - Generate PWA icon set (192×192, 512×512, maskable).
  - Add `<meta name="apple-mobile-web-app-capable">` and iOS splash screen meta tags.
  - **Acceptance:** installable on Android Chrome and iOS Safari; app icon appears correctly.

- [ ] **T9.3 Precaching & runtime caching strategy**
  - Precache: app shell (HTML, CSS, JS bundles), static data files (`juz.ts`, `pages.ts`).
  - Runtime cache with `StaleWhileRevalidate` for API calls (`/surat`, `/surat/:nomor`, `/tafsir/:nomor`).
  - Audio files: `CacheFirst` with a size-limited cache (max 50 MB / 100 entries, LRU eviction).
  - **Acceptance:** after first visit, the surah list and at least one previously visited surah detail page load fully offline; audio of previously played ayahs plays offline.

- [ ] **T9.4 Offline indicator & update prompt**
  - Show a subtle banner/toast when the app goes offline.
  - Show an update-available prompt (shadcn `dialog` or `sonner` toast) when a new service worker is waiting.
  - **Acceptance:** offline banner appears/disappears reactively; update prompt refreshes the app correctly.

---

## T10 — Semantic Ayah Search

> EQuran.id may provide a semantic/vector search endpoint. If unavailable,
> implement client-side full-text search over pre-fetched ayah data.

- [ ] **T10.1 Investigate EQuran.id semantic endpoint**
  - Check if `https://equran.id/api/v2` has a search or semantic endpoint.
  - If yes: document the endpoint shape, create a typed API function.
  - If no: plan a client-side approach — progressively fetch all 114 surahs in the background (idle time / web worker) and build an in-memory search index.
  - **Acceptance:** written decision document (can be a code comment or doc update) on the chosen approach.

- [ ] **T10.2 Build search index (client-side fallback)**
  - If using client-side search: create a `src/lib/searchIndex.ts` module.
  - On app mount (after surah list loads), start fetching surah details in the background (staggered, low priority — e.g. 2–3 concurrent, with `requestIdleCallback` or a queue).
  - Build a lightweight index mapping `teksIndonesia` (or `teksArab` / `teksLatin`) → `{ surah, ayah }`.
  - Store the index in memory (not localStorage — too large).
  - Show a progress indicator on the search page ("Mengindeks ayat… 45/114 surah").
  - **Acceptance:** index builds without blocking the main thread; search is responsive after indexing; progress indicator is accurate.

- [ ] **T10.3 Ayah-level search results**
  - Extend the search page to support a second "Cari Ayat" tab/toggle.
  - Results show: Arabic text snippet, Indonesian translation snippet (with query highlighted), surah:ayah reference, and a link to jump to the ayah.
  - Debounce 500 ms (longer than surah search to account for heavier computation).
  - **Acceptance:** searching "sabar" returns relevant ayahs across multiple surahs; results are paginated or virtualized (no rendering 6,000+ results at once); switching between surah search and ayah search is smooth.

---

## T11 — Share Ayah

- [ ] **T11.1 Share as text**
  - Add a "Share" button to the `AyahItem` action row.
  - Uses the Web Share API (`navigator.share`) if available; falls back to copy-to-clipboard.
  - Shared text format:
    ```
    ﴿ [Arabic text] ﴾

    "[Indonesian translation]"

    — QS. [Surah Latin Name] : [Ayah Number]
    ```
  - **Acceptance:** share works on mobile browsers with native share sheet; fallback copy works on desktop; toast confirms the action.

- [ ] **T11.2 Share as image**
  - Generate a shareable card image using `html2canvas` or the Canvas API.
  - Card design: dark gradient background, Arabic text centered, translation below, surah:ayah reference, subtle app branding.
  - The generated image is downloadable and shareable.
  - **Acceptance:** image renders correctly at a reasonable resolution (1080×1080 or similar); Arabic text is not clipped or garbled; the image can be shared via Web Share API (as a file) or downloaded.

---

## T12 — Phase 2 Polish

- [ ] **T12.1 Route updates & navigation**
  - Register all new routes (`/juz`, `/juz/:number`, `/surah/:nomor/tafsir`).
  - Update the navbar to include Juz navigation.
  - Ensure all new pages have proper `<title>` tags.
  - **Acceptance:** all routes work; deep links survive a page refresh; 404 for invalid juz numbers.

- [ ] **T12.2 Responsive & a11y pass (Phase 2 features)**
  - Verify all new components at 360/768/1280 px.
  - Check focus rings, tab order, `aria-label` coverage on audio controls, juz cards, tafsir panels.
  - Mini-player must be usable at 360 px without overlapping other elements.
  - **Acceptance:** no horizontal scroll at 360 px; every new interactive element reachable by keyboard.

- [ ] **T12.3 Performance audit**
  - Profile: surah detail page with 286 ayahs (Al-Baqarah) + tafsir + audio.
  - Ensure no unnecessary re-renders when audio state changes.
  - Virtualize the juz detail page if it contains many ayahs.
  - **Acceptance:** FCP < 2s on 4G throttle; no jank during audio playback; Lighthouse performance score ≥ 85.

- [ ] **T12.4 Build & deploy**
  - `pnpm build` with zero errors.
  - Deploy; verify all new deep links, PWA install, and offline functionality.
  - **Acceptance:** live URL; juz, tafsir, and audio features work in production; PWA installable.

---

## Phase 2 Definition of Done

All 30 juz browsable with correct ayah boundaries · mushaf page view renders continuous Arabic text with tappable ayah actions · reading mode toggle between ayah-list and mushaf works on surah and juz pages · tafsir viewable per ayah · audio plays per-ayah and per-surah with reciter selection · app installable as PWA and works offline for cached content · ayah-level search functional · ayah shareable as text and image · `pnpm build` clean · deployed.

**Do not start Phase 3 items** (auth + backend, additional translations) until the above is met.
