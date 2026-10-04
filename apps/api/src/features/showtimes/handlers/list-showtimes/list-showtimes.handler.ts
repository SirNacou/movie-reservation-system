import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager, type FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Showtime } from '../../domain/showtime.entity.js'

@Injectable()
export class ListShowtimesHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['showtimes']['list']) {
		const filter: FilterQuery<NoInfer<Showtime>> = {}

		if (input.movieId) {
			filter.movie = input.movieId
		}

		if (input.cinemaId) {
			filter.auditorium = {
				cinema: input.cinemaId,
			}
		}

		if (input.date) {
			const startOfDay = new Date(input.date)
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = new Date(input.date)
			endOfDay.setHours(23, 59, 59, 999)

			filter.startTime = { $gte: startOfDay, $lte: endOfDay }
		}

		const showtimes = await this.em.find(Showtime, filter, {
			populate: ['movie', 'auditorium', 'auditorium.cinema'],
			orderBy: { startTime: 'ASC' },
		})

		return R.succeed(
			showtimes.map((s) => ({
				id: s.id,
				movieId: s.movie.id,
				movieTitle: s.movie.title,
				cinemaId: s.auditorium.cinema.id,
				cinemaName: s.auditorium.cinema.name,
				auditoriumId: s.auditorium.id,
				auditoriumName: s.auditorium.name,
				startTime: s.startTime,
				endTime: s.endTime,
				durationMinutes: s.movie.durationMinutes,
			})),
		)
	}
}
