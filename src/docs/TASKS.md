# TASKS.md — Execution Breakdown

> Companion to `PLAN.md`. Work top to bottom; each task depends on the ones above it.

## Working Agreement

- Do **one task at a time**. Finish its acceptance criteria before starting the next.
- After each task: `pnpm build` must pass with zero TypeScript errors, mark task as done in this file, then commit.
- Commit format: `feat(scope): summary` / `fix(scope): summary` / `chore(scope): summary`.
- If a task's assumption turns out wrong (API shape, existing file, preset config), **stop and report** rather than working around it silently.
- Never modify the preset's theme tokens or `src/components/ui/` files unless a task says so explicitly.

---

## T0 — Recon & Foundation

- [x] **T0.1 Audit the existing scaffold**
  - Read `components.json`, `package.json`, `vite.config.ts`, `tsconfig.json`, `src/index.css`, and list `src/components/ui/`.
  - Record: Tailwind major version, primitives library (`@radix-ui/*` vs `@base-ui-components/*`), icon package, available theme tokens, dark-mode mechanism, `@/*` alias status.
  - **Acceptance:** a short written summary of the above exists (in the PR description or a scratch note); no code changed yet.

- [x] **T0.2 Verify the API contract**
  - `curl https://equran.id/api/v2/surat | head` and `curl https://equran.id/api/v2/surat/1`.
  - Compare against the types in `PLAN.md` §4.
  - **Acceptance:** `src/types/quran.ts` created, matching the **live** response exactly. Any deviation from PLAN.md is noted in the commit message.

- [x] **T0.3 Install missing dependencies**
  - Install only what `package.json` lacks: `@tanstack/react-query`, `react-router-dom`, `zustand`.
  - **Acceptance:** install succeeds, dev server still boots, no duplicate UI/icon libraries introduced.

- [x] **T0.4 API client layer**
  - `src/api/client.ts`: a typed `fetchApi<T>(path)` that unwraps `ApiResponse<T>`, throws a typed error on non-200 `code` or network failure.
  - `src/api/quran.ts`: `getSurahList()`, `getSurahDetail(nomor)`, `getTafsir(nomor)`.
  - **Acceptance:** functions are typed with no `any`; errors surface a readable message.

- [x] **T0.5 App shell, providers, routing**
  - Wrap the app in `QueryClientProvider` (defaults: `staleTime: Infinity`, `gcTime: 24h`, `retry: 2`) and `BrowserRouter`.
  - Create `src/components/layout/AppShell.tsx` + `Navbar.tsx`; register all routes from PLAN.md §5 with placeholder pages.
  - **Acceptance:** every route renders its placeholder; unknown paths hit NotFound; layout uses preset tokens only.

---

## T1 — Surah List (Home)

- [ ] **T1.1 `useSurahList` hook**
  - TanStack Query hook on key `['surahs']` calling `getSurahList()`.
  - **Acceptance:** returns 114 typed items; a second mount refetches nothing.

- [ ] **T1.2 `SurahCard` + `SurahList`**
  - Card shows: number badge, Arabic name, latin name, Indonesian meaning, ayah count, revelation place. Whole card is a link to `/surah/:nomor`.
  - Use shadcn `card` (add via CLI if absent).
  - **Acceptance:** grid is 1 column at 360 px, 2 at ≥768 px, 3 at ≥1280 px; Arabic name renders RTL; card is keyboard-focusable.

- [ ] **T1.3 Loading / error / empty states**
  - `LoadingSkeleton` (shadcn `skeleton`), `ErrorState` (message + retry button calling `refetch`), `EmptyState`.
  - **Acceptance:** all three reachable — verify error by temporarily pointing the client at a bad URL.

- [ ] **T1.4 Home page assembly**
  - Compose search bar slot (placeholder for now) + surah list.
  - **Acceptance:** `/` lists all 114 surahs from live data.

---

## T2 — Surah Detail

- [ ] **T2.1 `useSurahDetail` hook**
  - Key `['surah', nomor]`; guard invalid `nomor` (non-numeric, <1, >114) → redirect to NotFound.
  - **Acceptance:** invalid params never trigger a fetch.

- [ ] **T2.2 `SurahHeader`**
  - Surah name (Arabic + latin), meaning, ayah count, revelation place, sanitized `deskripsi` in a collapsible.
  - **Acceptance:** no raw HTML tags visible; collapsed by default.

- [ ] **T2.3 `AyahItem` + `BismillahHeader`**
  - Per ayah: number marker, Arabic (RTL, `line-height` ≥ 2, ≥ 24 px on mobile), latin transliteration, Indonesian translation.
  - Bismillah header rendered for every surah **except 1 and 9**.
  - **Acceptance:** text is never truncated or transformed; long surahs (e.g. 2) scroll smoothly.

- [ ] **T2.4 Ayah deep-link**
  - Support `?ayat=n`: scroll to that ayah on mount and highlight it briefly.
  - **Acceptance:** `/surah/2?ayat=255` lands on Ayat al-Kursi.

- [ ] **T2.5 Prev/next surah navigation**
  - Driven by `suratSebelumnya` / `suratSelanjutnya` (both can be `false`).
  - **Acceptance:** surah 1 hides "previous", surah 114 hides "next".

---

## T3 — Search

- [ ] **T3.1 `useDebounce` + `useSearch`**
  - Debounce 300 ms. Filter the cached `['surahs']` list on `namaLatin` (diacritic- and case-insensitive), `arti`, and `nomor`.
  - Detect `"2:255"` / `"2 255"` → return a direct-navigation intent.
  - **Acceptance:** "baqarah", "BAQARAH", "sapi", and "2" all find Al-Baqarah.

- [ ] **T3.2 `SearchBar` + `/search` page**
  - shadcn `input` with an icon; query synced to the URL (`/search?q=`); results reuse `SurahCard`.
  - **Acceptance:** results survive a page refresh; empty query shows a hint, no matches shows `EmptyState`; `"2:255"` navigates straight to the ayah.

---

## T4 — Bookmarks & Last Read

- [ ] **T4.1 Zustand stores**
  - `bookmarkStore` (`quran-bookmarks`), `lastReadStore` (`quran-last-read`), `settingsStore` (`quran-settings`) — all with `persist`. Shapes are in PLAN.md §5.
  - **Acceptance:** state survives a full page reload; malformed/absent `localStorage` data doesn't crash the app.

- [ ] **T4.2 Ayah actions**
  - Per-ayah: bookmark toggle (filled when saved) and copy-to-clipboard (Arabic + translation + reference). Toast feedback via shadcn `sonner`.
  - **Acceptance:** toggling twice leaves no duplicate entry; icon-only buttons have `aria-label`.

- [ ] **T4.3 Auto-save last read**
  - On surah detail, track the topmost visible ayah (IntersectionObserver, throttled) and persist it.
  - **Acceptance:** writes are throttled (not per scroll event); reopening the app resumes from the right ayah.

- [ ] **T4.4 `/bookmarks` page + continue-reading card**
  - Bookmarks list with snippet, jump link, and remove action. Home shows a "continue reading" card when last-read exists.
  - **Acceptance:** jumping from a bookmark lands on the exact ayah; empty bookmarks shows `EmptyState`.

---

## T5 — Polish

- [ ] **T5.1 Theme toggle**
  - Light / dark / system, driven by `settingsStore` and the preset's dark-mode mechanism.
  - **Acceptance:** no flash of wrong theme on load; preset tokens untouched.

- [ ] **T5.2 Reading settings**
  - Arabic font size (sm/md/lg), show/hide latin, show/hide translation — in a shadcn `sheet` or `dialog`.
  - **Acceptance:** settings apply instantly and persist.

- [ ] **T5.3 Responsive & a11y pass**
  - Verify at 360 / 768 / 1280 px. Check focus rings, tab order, contrast in both themes, `aria-label` coverage.
  - **Acceptance:** no horizontal scroll at 360 px; every interactive element reachable by keyboard.

- [ ] **T5.4 Hardening**
  - Error boundary; surah-list fallback to last cached copy when the API fails; `<title>` per route.
  - **Acceptance:** app degrades gracefully with the network offline.

- [ ] **T5.5 Deploy**
  - Build, deploy static output, verify SPA rewrite so deep links like `/surah/18` work on refresh.
  - **Acceptance:** live URL; direct deep links load correctly.

---

## Phase 1 Definition of Done

All 114 surahs readable end-to-end · search finds any surah by name, meaning, or number · bookmarks and last-read survive reload · usable one-handed at 360 px · `pnpm build` clean · deployed.

**Do not start Phase 2 items** (audio player, tafsir, PWA, semantic search) until the above is met.
