import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager, type FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Showtime } from '../../domain/showtime.entity.js'

@Injectable()
export class ListShowtimesByMovieHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['showtimes']['listByMovie']) {
		const filter: FilterQuery<NoInfer<Showtime>> = {
			movie: input.movieId,
		}

		if (input.date) {
			const startOfDay = input.date
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = input.date
			endOfDay.setHours(23, 59, 59, 999)

			filter.startTime = { $gte: startOfDay, $lte: endOfDay }
		} else {
			// Default to future screenings only
			filter.startTime = { $gte: new Date() }
		}

		const showtimes = await this.em.find(Showtime, filter, {
			populate: ['auditorium', 'auditorium.cinema'],
			orderBy: { startTime: 'ASC' },
		})

		return R.succeed(
			showtimes.map((s) => ({
				id: s.id,
				auditoriumId: s.auditorium.id,
				auditoriumName: s.auditorium.name,
				cinemaId: s.auditorium.cinema.id,
				cinemaName: s.auditorium.cinema.name,
				cinemaCity: s.auditorium.cinema.city,
				startTime: s.startTime,
				endTime: s.endTime,
			})),
		)
	}
}
