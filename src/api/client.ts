import type { ApiResponse } from "@/types/quran"

const BASE_URL = "https://equran.id/api/v2"

/** Error thrown when the API returns a non-200 code or a network request fails. */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

/**
 * Generic fetcher that calls the EQuran.id API, unwraps the ApiResponse
 * envelope, and returns the typed payload. Throws ApiError on non-200 codes
 * or network failures.
 */
export async function fetchApi<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : "Network request failed",
      0,
    )
  }

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`, res.status)
  }

  const json = (await res.json()) as ApiResponse<T>

  if (json.code !== 200) {
    throw new ApiError(json.message || "Unknown API error", json.code)
  }

  return json.data
}
