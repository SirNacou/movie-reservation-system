import { createCinemaContract } from './features/cinemas/create.contract.js'
import { deleteCinemaContract } from './features/cinemas/delete.contract.js'
import { listCinemasContract } from './features/cinemas/list.contract.js'
import { listMoviesContract } from './features/movies/list.contract.js'
import { syncTmdbContract } from './features/movies/sync-tmdb.contract.js'

export const contract = {
	movies: {
		list: listMoviesContract,
		syncTmdb: syncTmdbContract,
	},
	cinemas: {
		list: listCinemasContract,
		create: createCinemaContract,
		delete: deleteCinemaContract,
	},
}

export type Contract = typeof contract
export * from './features/cinemas/create.contract.js'
