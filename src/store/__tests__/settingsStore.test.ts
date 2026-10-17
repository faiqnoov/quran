import test from "node:test"
import assert from "node:assert/strict"
import { useSettingsStore } from "../settingsStore.ts"

test("readingMode defaults to 'ayah'", () => {
  const state = useSettingsStore.getState()
  assert.equal(state.readingMode, "ayah")
})

test("setReadingMode switches mode between 'ayah' and 'mushaf'", () => {
  const store = useSettingsStore.getState()

  store.setReadingMode("mushaf")
  assert.equal(useSettingsStore.getState().readingMode, "mushaf")

  store.setReadingMode("ayah")
  assert.equal(useSettingsStore.getState().readingMode, "ayah")
})
