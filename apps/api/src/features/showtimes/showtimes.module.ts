import { Module } from '@nestjs/common'
import { CancelShowtimeHandler } from './handlers/cancel-showtime/cancel-showtime.handler.js'
import { GetShowtimeHandler } from './handlers/get-showtime/get-showtime.handler.js'
import { ListShowtimesByAuditoriumHandler } from './handlers/list-showtimes-by-auditorium/list-showtimes-by-auditorium.handler.js'
import { ListShowtimesByMovieHandler } from './handlers/list-showtimes-by-movie/list-showtimes-by-movie.handler.js'
import { ScheduleShowtimeHandler } from './handlers/schedule-showtime/schedule-showtime.handler.js'
import { ShowtimesController } from './showtimes.controller.js'

@Module({
	providers: [
		ScheduleShowtimeHandler,
		GetShowtimeHandler,
		ListShowtimesByMovieHandler,
		ListShowtimesByAuditoriumHandler,
		CancelShowtimeHandler,
	],
	controllers: [ShowtimesController],
})
export class ShowtimesModule {}
