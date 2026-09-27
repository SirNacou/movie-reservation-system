export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type TmdbPosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'

export type TmdbBackdropSize = 'w300' | 'w780' | 'w1280' | 'original'

export type TmdbImageSize = TmdbPosterSize | TmdbBackdropSize

interface BuildTmdbImageUrlOptions {
	size?: TmdbImageSize
	fallbackUrl?: string
}

/**
 * Builds a valid image URL from a TMDB path or API posterUrl.
 *
 * @param path - The image path from the API (e.g. "/abc123.jpg", full url, or null)
 * @param options - Configuration options for image size and fallback
 * @returns Fully qualified image URL or fallback
 */
export function buildTmdbImageUrl(
	path?: string | null,
	options: BuildTmdbImageUrlOptions = {}
): string {
	const { size = 'w500', fallbackUrl = '/placeholder-poster.png' } = options

	if (!path) {
		return fallbackUrl
	}

	// If the API already stored or returned a full URL, return it directly
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path
	}

	// Normalize path to ensure leading slash
	const cleanPath = path.startsWith('/') ? path : `/${path}`

	return `${TMDB_IMAGE_BASE_URL}/${size}${cleanPath}`
}
