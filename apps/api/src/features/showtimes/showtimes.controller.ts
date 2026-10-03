import { Controller } from '@nestjs/common'
import { Implement } from '@orpc/nest'
import { implement, ORPCError } from '@orpc/server'
import { R } from '@praha/byethrow'
import { contract } from '@repo/contract'
import { CancelShowtimeHandler } from './handlers/cancel-showtime/cancel-showtime.handler.js'
import { GetShowtimeHandler } from './handlers/get-showtime/get-showtime.handler.js'
import { ListShowtimesByAuditoriumHandler } from './handlers/list-showtimes-by-auditorium/list-showtimes-by-auditorium.handler.js'
import { ListShowtimesByMovieHandler } from './handlers/list-showtimes-by-movie/list-showtimes-by-movie.handler.js'
import { ScheduleShowtimeHandler } from './handlers/schedule-showtime/schedule-showtime.handler.js'

@Controller()
export class ShowtimesController {
	constructor(
		private readonly scheduleShowtimeHandler: ScheduleShowtimeHandler,
		private readonly getShowtimeHandler: GetShowtimeHandler,
		private readonly listShowtimesByMovieHandler: ListShowtimesByMovieHandler,
		private readonly listShowtimesByAuditoriumHandler: ListShowtimesByAuditoriumHandler,
		private readonly cancelShowtimeHandler: CancelShowtimeHandler,
	) {}

	@Implement(contract.showtimes)
	showtimes() {
		return {
			schedule: implement(contract.showtimes.schedule).handler(async ({ input }) => {
				const res = await this.scheduleShowtimeHandler.handle(input)
				if (R.isFailure(res)) {
					throw new ORPCError(res.error.message)
				}

				return res.value
			}),
			get: implement(contract.showtimes.get).handler(async ({ input }) => {
				const res = await this.getShowtimeHandler.handle(input)
				if (R.isFailure(res)) {
					throw new ORPCError(res.error.message)
				}

				return res.value
			}),
			listByMovie: implement(contract.showtimes.listByMovie).handler(async ({ input }) => {
				const res = await this.listShowtimesByMovieHandler.handle(input)
				if (R.isFailure(res)) {
					throw new ORPCError(res.error)
				}

				return res.value
			}),
			listByAuditorium: implement(contract.showtimes.listByAuditorium).handler(
				async ({ input }) => {
					const res = await this.listShowtimesByAuditoriumHandler.handle(input)
					if (R.isFailure(res)) {
						throw new ORPCError(res.error)
					}

					return res.value
				},
			),
			cancel: implement(contract.showtimes.cancel).handler(async ({ input }) => {
				const res = await this.cancelShowtimeHandler.handle(input)
				if (R.isFailure(res)) {
					throw new ORPCError(res.error.message)
				}

				return res.value
			}),
		}
	}
}
