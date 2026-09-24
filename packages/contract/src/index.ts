import { listMoviesContract } from "./features/movies/list-movies/list-movies.contract.js";
import { syncTmdbContract } from "./features/movies/sync-tmdb/sync-tmdb.contract.js";

export const contract = {
	movies: {
		list: listMoviesContract,
		syncTmdb: syncTmdbContract,
	},
};

export type Contract = typeof contract;
