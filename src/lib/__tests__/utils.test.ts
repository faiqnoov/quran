import test from "node:test"
import assert from "node:assert/strict"
import { toArabicDigits, formatArabicText } from "../utils.ts"

test("toArabicDigits converts single and multi-digit Western numerals to Eastern Arabic", () => {
  assert.equal(toArabicDigits(0), "٠")
  assert.equal(toArabicDigits(1), "١")
  assert.equal(toArabicDigits(7), "٧")
  assert.equal(toArabicDigits(10), "١٠")
  assert.equal(toArabicDigits(255), "٢٥٥")
  assert.equal(toArabicDigits(604), "٦٠٤")
})

test("formatArabicText attaches isolated waqf signs and combining marks to preceding words", () => {
  // Ayah 171 with waqf marks preceded by spaces
  const sample = "وَكَلِمَتُهٗ ۚ اَلْقٰىهَآ وَرُوْحٌ مِّنْهُ ۖفَاٰمِنُوْا ثَلٰثَةٌ  ۗاِنْتَهُوْا"
  const formatted = formatArabicText(sample)
  assert.equal(
    formatted,
    "وَكَلِمَتُهٗۚ اَلْقٰىهَآ وَرُوْحٌ مِّنْهُۖ فَاٰمِنُوْا ثَلٰثَةٌۗ اِنْتَهُوْا"
  )
  // Ensure no combining mark is preceded by a space
  assert.equal(
    /\s+[\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u08D6]/.test(formatted),
    false
  )
})

test("formatArabicText normalizes leading nun wiqayah", () => {
  const sample = " ۨالَّذِيْنَ"
  assert.equal(formatArabicText(sample), "اۨلَّذِيْنَ")
})
