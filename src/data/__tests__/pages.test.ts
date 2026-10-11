import test from "node:test"
import assert from "node:assert/strict"
import {
  MUSHAF_PAGES,
  getPageForAyah,
  getAyahsInPage,
  getJuzForPage,
  getSurahsOnPage,
} from "../pages.ts"

test("MUSHAF_PAGES contains exactly 604 valid sequential pages", () => {
  assert.equal(MUSHAF_PAGES.length, 604)

  for (let i = 0; i < 604; i++) {
    const page = MUSHAF_PAGES[i]
    assert.equal(page.page, i + 1)
    assert.ok(page.startSurah >= 1 && page.startSurah <= 114)
    assert.ok(page.endSurah >= page.startSurah && page.endSurah <= 114)
    assert.ok(page.startAyah >= 1)
    assert.ok(page.endAyah >= 1)
  }
})

test("Mushaf boundary pages (Page 1, 2, 603, 604)", () => {
  // Page 1: Al-Fatihah 1:1 - 1:7
  assert.deepEqual(getAyahsInPage(1), {
    page: 1,
    startSurah: 1,
    startAyah: 1,
    endSurah: 1,
    endAyah: 7,
  })

  // Page 2: Al-Baqarah 2:1 - 2:5
  assert.deepEqual(getAyahsInPage(2), {
    page: 2,
    startSurah: 2,
    startAyah: 1,
    endSurah: 2,
    endAyah: 5,
  })

  // Page 603: 109:1 - 111:5
  assert.deepEqual(getAyahsInPage(603), {
    page: 603,
    startSurah: 109,
    startAyah: 1,
    endSurah: 111,
    endAyah: 5,
  })

  // Page 604: 112:1 - 114:6
  assert.deepEqual(getAyahsInPage(604), {
    page: 604,
    startSurah: 112,
    startAyah: 1,
    endSurah: 114,
    endAyah: 6,
  })
})

test("getPageForAyah finds correct page for various locations and mid-surah page breaks", () => {
  // Al-Fatihah
  assert.equal(getPageForAyah(1, 1), 1)
  assert.equal(getPageForAyah(1, 7), 1)

  // Mid-surah page break: Al-Baqarah 2:5 is on page 2, 2:6 is on page 3
  assert.equal(getPageForAyah(2, 5), 2)
  assert.equal(getPageForAyah(2, 6), 3)

  // Ayah 2:16 is on page 3, 2:17 is on page 4
  assert.equal(getPageForAyah(2, 16), 3)
  assert.equal(getPageForAyah(2, 17), 4)

  // Juz 15 start (Al-Isra 17:1) is on page 282
  assert.equal(getPageForAyah(17, 1), 282)

  // Juz 30 start (An-Naba 78:1) is on page 582
  assert.equal(getPageForAyah(78, 1), 582)

  // End of Quran
  assert.equal(getPageForAyah(114, 6), 604)

  // Clamping
  assert.equal(getPageForAyah(0, 0), 1)
  assert.equal(getPageForAyah(999, 999), 604)
})

test("getJuzForPage returns correct juz for pages", () => {
  assert.equal(getJuzForPage(1), 1)
  assert.equal(getJuzForPage(21), 1)
  assert.equal(getJuzForPage(22), 2)
  assert.equal(getJuzForPage(282), 15)
  assert.equal(getJuzForPage(582), 30)
  assert.equal(getJuzForPage(604), 30)

  // Clamped inputs
  assert.equal(getJuzForPage(0), 1)
  assert.equal(getJuzForPage(1000), 30)
})

test("getSurahsOnPage accurately returns single and multi-surah pages", () => {
  // Single surah page
  assert.deepEqual(getSurahsOnPage(1), [1])
  assert.deepEqual(getSurahsOnPage(2), [2])

  // Multi-surah page (3 surahs on page 604: Al-Ikhlas, Al-Falaq, An-Nas)
  assert.deepEqual(getSurahsOnPage(604), [112, 113, 114])

  // Multi-surah page 603 (109: Al-Kafirun, 110: An-Nasr, 111: Al-Masad)
  assert.deepEqual(getSurahsOnPage(603), [109, 110, 111])

  // Multi-surah page 599 (98: Al-Bayyinah, 99: Az-Zalzalah, 100: Al-Adiyat)
  assert.deepEqual(getSurahsOnPage(599), [98, 99, 100])
})
