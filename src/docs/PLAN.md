# PLAN.md — Digital Qur'an Web App

> Primary spec document. Agents must read this before generating or modifying code.
> Step-by-step execution order lives in `TASKS.md`.

## 1. Project Brief

A responsive, mobile-first web app for reading the Qur'an: Arabic text, Indonesian translation, surah/ayah search, and bookmarks. Data comes from a free public API (EQuran.id v2). No backend, no auth — all user state lives in `localStorage`.

**UI language:** Bahasa Indonesia. **Code, comments, commits:** English.

## 2. Tech Stack (fixed — do not substitute)

| Layer | Choice |
|---|---|
| Build | Vite |
| Framework | React + TypeScript (strict) |
| UI components | **shadcn/ui** (already scaffolded, see §3) |
| Styling | Tailwind CSS |
| Routing | React Router |
| Server state | TanStack Query |
| Client state | Zustand + `persist` middleware (`localStorage`) |
| Deploy | Vercel / Netlify (static) |

Not to be added: any second UI kit (MUI, Chakra, Ant), any CSS-in-JS library, Redux, axios.

## 3. Existing Repo State — Read Before Writing Code

The repo was **already initialized** from a shadcn/ui `create` preset (`template=vite`, `base=radix`, `pointer=true`, preset `b7Br7G7Ci`). Scaffolding, theming, and shadcn config already exist. Treat them as given.

**Discover the actual setup first — do not assume:**

1. `components.json` — resolved aliases, icon library, style, base color, and any configured registries. This is the source of truth for `shadcn add`.
2. `src/index.css` (or equivalent) — the preset's theme tokens. Note whether Tailwind v4 (`@import "tailwindcss"` + `@theme`, no `tailwind.config.js`) or v3 (config file + `@tailwind` directives) is in use, and how `.dark` is defined.
3. `package.json` — Tailwind major version, which primitives are installed (`@radix-ui/*` vs `@base-ui-components/*`), icon package, and which deps from §2 are still missing.
4. `src/components/ui/` — components the preset already shipped.
5. `vite.config.ts` + `tsconfig.json` — confirm the `@/*` path alias resolves.

**Rules:**
- **Never overwrite the preset's theme tokens, fonts, or `globals`/`index.css` color definitions.** Consume them; extend only by adding new tokens.
- Add components with `pnpm dlx shadcn@latest add <name>` so the preset's registry and styling are respected. Do not hand-write a component that exists in the registry, and do not copy component source from the docs site.
- Components in `src/components/ui/` are **owned source code** — editing them is allowed; re-running `add` on an edited file will clobber it, so prefer composing wrappers in `src/components/` instead.
- Match the icon library already installed; do not introduce a second one.
- Use semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`). Never hardcode hex or raw Tailwind palette colors (`bg-slate-800`).
- Components likely needed across the project: `button`, `input`, `card`, `skeleton`, `sheet`, `dialog`, `scroll-area`, `switch`, `dropdown-menu`, `tabs`, `separator`, `sonner`. Add them per task, not all upfront.

Still to install (verify against `package.json` first):
`@tanstack/react-query react-router-dom zustand`

## 4. Data Source

Base URL: `https://equran.id/api/v2` — free, no API key, source data from Kemenag RI.

All responses are wrapped: `{ code: number, message: string, data: T }`.

| Endpoint | Returns |
|---|---|
| `GET /surat` | All 114 surahs (list metadata) |
| `GET /surat/{nomor}` | Surah detail + all ayahs + per-ayah audio |
| `GET /tafsir/{nomor}` | Kemenag tafsir for every ayah in the surah |

Six reciters are keyed `"01"`–`"06"`: `01` Abdullah Al-Juhany, `02` Abdul Muhsin Al-Qasim, `03` Abdurrahman As-Sudais, `04` Ibrahim Al-Dossari, `05` Misyari Rasyid Al-Afasy, `06` Yasser Al-Dosari.

### Types (`src/types/quran.ts`)

```ts
export interface ApiResponse<T> { code: number; message: string; data: T }

export interface SurahMeta {
  nomor: number;
  nama: string;          // Arabic name
  namaLatin: string;     // e.g. "Al-Baqarah"
  jumlahAyat: number;
  tempatTurun: string;   // "Mekah" | "Madinah"
  arti: string;          // Indonesian meaning
  deskripsi: string;     // contains HTML
  audioFull: Record<string, string>;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends SurahMeta {
  ayat: Ayah[];
  suratSelanjutnya: SurahMeta | false;
  suratSebelumnya: SurahMeta | false;
}
```

**Verify field names against a live response before building on them** (`curl https://equran.id/api/v2/surat/1`). If reality differs from the types above, fix the types — not the runtime code.

### Notes & constraints
- `deskripsi` contains raw HTML → sanitize or strip tags before rendering.
- The API has **no full-text search endpoint**. Search is client-side (see §6).
- Third-party API can go down: every query needs an error state, and the surah list should fall back to its last cached copy.

## 5. Architecture

```
src/
├─ api/            # fetch wrappers, unwrap ApiResponse, throw on code !== 200
│  ├─ client.ts        # base fetcher
│  └─ quran.ts         # getSurahList, getSurahDetail, getTafsir
├─ components/
│  ├─ ui/              # shadcn/ui — preset-owned, add via CLI
│  ├─ layout/          # AppShell, Navbar, ThemeToggle
│  ├─ surah/           # SurahCard, SurahList, SurahHeader
│  ├─ ayah/            # AyahItem, AyahActions, BismillahHeader
│  └─ common/          # SearchBar, EmptyState, ErrorState, LoadingSkeleton
├─ hooks/          # useSurahList, useSurahDetail, useSearch, useDebounce
├─ pages/          # Home, SurahDetail, Search, Bookmarks, NotFound
├─ store/          # bookmarkStore, lastReadStore, settingsStore (Zustand + persist)
├─ types/
├─ lib/            # utils.ts (cn — already exists), formatters
└─ App.tsx
```

### Routes
| Path | Page |
|---|---|
| `/` | Home — continue-reading card, search bar, surah list |
| `/surah/:nomor` | Surah detail (supports `?ayat=n` to scroll to an ayah) |
| `/search` | Search results |
| `/bookmarks` | Saved ayahs |
| `*` | NotFound |

### Persisted state (`localStorage`)
```ts
// key: quran-bookmarks
type Bookmark = { surahNumber: number; surahName: string; ayahNumber: number; snippet: string; createdAt: number }
// key: quran-last-read
type LastRead = { surahNumber: number; surahName: string; ayahNumber: number; updatedAt: number }
// key: quran-settings
type Settings = { theme: 'light' | 'dark' | 'system'; arabicFontSize: 'sm' | 'md' | 'lg'; showLatin: boolean; showTranslation: boolean }
```

### Data-fetching conventions
- Query keys: `['surahs']`, `['surah', nomor]`, `['tafsir', nomor]`.
- Qur'an data is immutable → `staleTime: Infinity`, `gcTime: 24h`, `retry: 2`.
- Prefetch `['surahs']` on app mount; it powers both the home list and search.

## 6. Search Behavior (Phase 1)

Runs fully client-side over the cached `['surahs']` list:
- Match on `namaLatin` (diacritic- and case-insensitive), `arti`, and `nomor`.
- Debounce input by 300 ms.
- Also accept `"2:255"` / `"2 255"` syntax → navigate straight to `/surah/2?ayat=255`.
- Ayah-level text search across all 6,236 ayahs is **out of scope for Phase 1** (would require fetching all 114 surahs). Phase 2 adds it via EQuran.id's semantic vector endpoint.

## 7. Roadmap

### Phase 1 — MVP
Surah list → surah detail (Arabic + latin + Indonesian) → search → bookmarks & last read → polish & deploy.
See `TASKS.md` for the ordered breakdown.

**Phase 1 done when:** all 114 surahs are readable end-to-end, search finds any surah by name/meaning/number, bookmarks and last-read survive a page reload, and the app is usable one-handed on a 360 px screen.

### Phase 2
- Murottal audio player (per-ayah + full surah, reciter picker, autoplay to next ayah, sticky mini-player, lazy loading — never preload all ayahs)
- Tafsir per ayah (collapsible, from `/tafsir/{nomor}`)
- Semantic ayah search (EQuran.id vector API)
- PWA / offline reading (`vite-plugin-pwa`)
- Juz and mushaf-page navigation
- Share ayah as text or image

### Phase 3
- Auth + backend so bookmarks sync across devices
- Additional translation languages

## 8. Non-Negotiables

- **Mobile-first.** Design at 360 px, then scale up.
- **Arabic text:** `dir="rtl"`, generous `line-height` (≥ 2), font size never below 24 px on mobile.
- **Handle the Qur'anic text with care** — never truncate, auto-correct, or transform Arabic text or translations; render exactly what the API returns.
- Every async view has three states: loading (skeleton), error (message + retry), empty.
- No `any` in TypeScript. No hardcoded colors.
- **Keep component files under ~200 lines.**
- Accessibility: keyboard-navigable, visible focus rings, `aria-label` on icon-only buttons.
- `pnpm build` must pass with zero TypeScript errors before any task is considered done.
