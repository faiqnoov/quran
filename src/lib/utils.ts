import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]

/**
 * Normalizes Arabic text by ensuring Quranic combining marks and waqf signs
 * attach directly to the preceding word rather than floating after whitespace.
 * Prevents mobile browsers (HarfBuzz / CoreText) from rendering missing-glyph
 * rectangles (tofu / dotted circle placeholders) for isolated combining marks.
 */
export function formatArabicText(text: string): string {
  if (!text) return ""
  return text
    // Handle leading nun wiqayah / floating mark at start of string (e.g. " ۨالَّذِيْنَ")
    .replace(/^\s*([\u06E8])([\u0627-\u064A])/, "$2$1")
    // Attach isolated waqf/combining marks to preceding word, preserving space after
    .replace(
      /\s+([\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u08D4-\u08E1\u08D6])\s*/g,
      "$1 "
    )
}

/**
 * Converts standard Western numerals (0–9) to Eastern Arabic numerals (٠–٩).
 */
export function toArabicDigits(num: number): string {
  return String(num)
    .split("")
    .map((d) => ARABIC_DIGITS[Number(d)] ?? d)
    .join("")
}

