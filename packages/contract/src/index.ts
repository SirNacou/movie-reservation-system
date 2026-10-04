import { configureAuditoriumLayoutContract } from './features/cinemas/configure-auditorium-layout.contract.js'
import { createAuditoriumContract } from './features/cinemas/create-auditorium.contract.js'
import { createCinemaContract } from './features/cinemas/create-cinema.contract.js'
import { deleteCinemaContract } from './features/cinemas/delete-cinema.contract.js'
import { getAuditoriumLayoutContract } from './features/cinemas/get-auditorium-layout.contract.js'
import { getCinemaContract } from './features/cinemas/get-cinema.contract.js'
import { listAuditoriumsContract } from './features/cinemas/list-auditoriums.contract.js'
import { listCinemasContract } from './features/cinemas/list-cinemas.contract.js'
import { updateCinemaContract } from './features/cinemas/update-cinema.contract.js'
import { listMoviesContract } from './features/movies/list.contract.js'
import { syncTmdbContract } from './features/movies/sync-tmdb.contract.js'
import { cancelShowtimeContract } from './features/showtimes/cancel-showtime.contract.js'
import { getShowtimeContract } from './features/showtimes/get-showtime.contract.js'
import { listShowtimesByAuditoriumContract } from './features/showtimes/list-showtimes-by-auditorium.contract.js'
import { listShowtimesByMovieContract } from './features/showtimes/list-showtimes-by-movie.contract.js'
import { listShowtimesContract } from './features/showtimes/list-showtimes.contract.js'
import { scheduleShowtimeContract } from './features/showtimes/schedule-showtime.contract.js'

export { SeatTypeSchema } from './features/cinemas/configure-auditorium-layout.contract.js'

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
		listAuditoriums: listAuditoriumsContract,
	},
	showtimes: {
		schedule: scheduleShowtimeContract,
		get: getShowtimeContract,
		list: listShowtimesContract,
		listByMovie: listShowtimesByMovieContract,
		listByAuditorium: listShowtimesByAuditoriumContract,
		cancel: cancelShowtimeContract,
	},
}

export type Contract = typeof contract
export * from './features/cinemas/configure-auditorium-layout.contract.js'
export * from './features/cinemas/create-cinema.contract.js'

export * from './features/showtimes/schedule-showtime.contract.js'
