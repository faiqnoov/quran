import test from "node:test"
import assert from "node:assert/strict"
import { toArabicDigits } from "../utils.ts"

test("toArabicDigits converts single and multi-digit Western numerals to Eastern Arabic", () => {
  assert.equal(toArabicDigits(0), "٠")
  assert.equal(toArabicDigits(1), "١")
  assert.equal(toArabicDigits(7), "٧")
  assert.equal(toArabicDigits(10), "١٠")
  assert.equal(toArabicDigits(255), "٢٥٥")
  assert.equal(toArabicDigits(604), "٦٠٤")
})
