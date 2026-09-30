import { configureAuditoriumLayoutContract } from './features/cinemas/configure-auditorium-layout.contract.js'
import { createAuditoriumContract } from './features/cinemas/create-auditorium.contract.js'
import { createCinemaContract } from './features/cinemas/create-cinema.contract.js'
import { deleteCinemaContract } from './features/cinemas/delete-cinema.contract.js'
import { getAuditoriumLayoutContract } from './features/cinemas/get-auditorium-layout.contract.js'
import { getCinemaContract } from './features/cinemas/get-cinema.contract.js'
import { listCinemasContract } from './features/cinemas/list-cinemas.contract.js'
import { updateCinemaContract } from './features/cinemas/update-cinema.contract.js'
import { listMoviesContract } from './features/movies/list.contract.js'
import { syncTmdbContract } from './features/movies/sync-tmdb.contract.js'

export const contract = {
	movies: {
		list: listMoviesContract,
		syncTmdb: syncTmdbContract,
	},
	cinemas: {
		get: getCinemaContract,
		list: listCinemasContract,
		create: createCinemaContract,
		update: updateCinemaContract,
		delete: deleteCinemaContract,
		createAuditorium: createAuditoriumContract,
		configureLayout: configureAuditoriumLayoutContract,
		getLayout: getAuditoriumLayoutContract,
	},
}

export type Contract = typeof contract
export * from './features/cinemas/create-cinema.contract.js'
