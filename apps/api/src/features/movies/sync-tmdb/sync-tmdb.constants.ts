export const TMDB_SYNC_QUEUE = 'tmdb-sync-queue';

export const TMDB_JOBS = {
	SYNC_TRENDING_PAGE: 'sync-trending-page',
	IMPORT_MOVIE: 'import_movie',
};

export interface ImportMovieJobPayload {
	tmdbId: number;
}

export interface SyncPageJobPayload {
	page: number;
}
