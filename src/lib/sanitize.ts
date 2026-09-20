/**
 * Sanitizes an HTML string to prevent XSS while preserving harmless formatting tags
 * (e.g. <p>, <i>, <b>, <em>, <strong>, <br>).
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return ""

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    // Fallback in non-browser environments: strip all HTML tags
    return rawHtml.replace(/<[^>]*>/g, "").trim()
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHtml, "text/html")

  // Remove dangerous executable or layout-breaking elements
  const dangerousSelectors = [
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "base",
    "form",
    "input",
    "button",
  ].join(",")

  doc.querySelectorAll(dangerousSelectors).forEach((el) => el.remove())

  // Strip event handler attributes (onclick, onerror, etc.) and javascript: links
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      const value = attr.value.toLowerCase().replace(/\s+/g, "")
      if (name.startsWith("on") || value.startsWith("javascript:")) {
        el.removeAttribute(attr.name)
      }
    }
  })

  return doc.body.innerHTML
}

/**
 * Strips all HTML tags and returns plain text.
 */
export function stripHtml(rawHtml: string): string {
  if (!rawHtml) return ""

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(rawHtml, "text/html")
    return doc.body.textContent || ""
  }

  return rawHtml.replace(/<[^>]*>/g, "").trim()
}
