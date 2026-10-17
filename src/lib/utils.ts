import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]

/**
 * Converts standard Western numerals (0–9) to Eastern Arabic numerals (٠–٩).
 */
export function toArabicDigits(num: number): string {
  return String(num)
    .split("")
    .map((d) => ARABIC_DIGITS[Number(d)] ?? d)
    .join("")
}

