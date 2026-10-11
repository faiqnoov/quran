import test from "node:test"
import assert from "node:assert/strict"
import {
  JUZ_DATA,
  getJuzForAyah,
  getSurahsInJuz,
  getSurahNumbersInJuz,
} from "../juz.ts"

test("JUZ_DATA contains exactly 30 valid entries", () => {
  assert.equal(JUZ_DATA.length, 30)

  for (let i = 0; i < 30; i++) {
    const entry = JUZ_DATA[i]
    assert.equal(entry.juz, i + 1)
    assert.ok(entry.startSurah >= 1 && entry.startSurah <= 114)
    assert.ok(entry.endSurah >= entry.startSurah && entry.endSurah <= 114)
    assert.ok(entry.startAyah >= 1)
    assert.ok(entry.endAyah >= 1)
  }
})

test("Juz boundary test: first, intermediate, and last juz", () => {
  // Juz 1: 1:1 -> 2:141
  const j1 = JUZ_DATA[0]
  assert.deepEqual(j1, {
    juz: 1,
    startSurah: 1,
    startAyah: 1,
    endSurah: 2,
    endAyah: 141,
  })

  // Juz 15: 17:1 -> 18:74
  const j15 = JUZ_DATA[14]
  assert.deepEqual(j15, {
    juz: 15,
    startSurah: 17,
    startAyah: 1,
    endSurah: 18,
    endAyah: 74,
  })

  // Juz 30: 78:1 -> 114:6
  const j30 = JUZ_DATA[29]
  assert.deepEqual(j30, {
    juz: 30,
    startSurah: 78,
    startAyah: 1,
    endSurah: 114,
    endAyah: 6,
  })
})

test("getJuzForAyah identifies correct juz across transitions", () => {
  // Juz 1 start, middle, and end
  assert.equal(getJuzForAyah(1, 1), 1)
  assert.equal(getJuzForAyah(2, 50), 1)
  assert.equal(getJuzForAyah(2, 141), 1)

  // Juz 2 starts immediately at 2:142
  assert.equal(getJuzForAyah(2, 142), 2)
  assert.equal(getJuzForAyah(2, 252), 2)

  // Juz 3 starts at 2:253, ends at 3:92
  assert.equal(getJuzForAyah(2, 253), 3)
  assert.equal(getJuzForAyah(3, 1), 3)
  assert.equal(getJuzForAyah(3, 92), 3)

  // Juz 4 starts at 3:93
  assert.equal(getJuzForAyah(3, 93), 4)

  // Juz 15 / 16 boundary: Al-Kahf 74 vs 75
  assert.equal(getJuzForAyah(17, 1), 15)
  assert.equal(getJuzForAyah(18, 74), 15)
  assert.equal(getJuzForAyah(18, 75), 16)

  // Juz 30 start and end
  assert.equal(getJuzForAyah(78, 1), 30)
  assert.equal(getJuzForAyah(114, 6), 30)

  // Out of bounds clamping / fallback
  assert.equal(getJuzForAyah(0, 0), 1)
  assert.equal(getJuzForAyah(115, 1), 30)
})

test("getSurahsInJuz and getSurahNumbersInJuz", () => {
  const juz1 = getSurahsInJuz(1)
  assert.equal(juz1.juz, 1)
  assert.deepEqual(getSurahNumbersInJuz(1), [1, 2])

  const juz30 = getSurahsInJuz(30)
  assert.equal(juz30.juz, 30)
  assert.equal(juz30.startSurah, 78)
  assert.equal(juz30.endSurah, 114)
  const surahs30 = getSurahNumbersInJuz(30)
  assert.equal(surahs30.length, 37) // 78 to 114 inclusive = 37 surahs
  assert.equal(surahs30[0], 78)
  assert.equal(surahs30[surahs30.length - 1], 114)

  // Clamping for invalid inputs
  assert.equal(getSurahsInJuz(0).juz, 1)
  assert.equal(getSurahsInJuz(99).juz, 30)
})
