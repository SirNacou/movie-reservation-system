import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager, type FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Showtime } from '../../domain/showtime.entity.js'

@Injectable()
export class ListShowtimesByAuditoriumHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['showtimes']['listByAuditorium']) {
		const filter: FilterQuery<NoInfer<Showtime>> = {
			auditorium: input.auditoriumId,
		}

		if (input.date) {
			const startOfDay = input.date
			startOfDay.setHours(0, 0, 0, 0)

			const endOfDay = input.date
			endOfDay.setHours(23, 59, 59, 999)

			filter.startTime = { $gte: startOfDay, $lte: endOfDay }
		}

		const showtimes = await this.em.find(Showtime, filter, {
			populate: ['movie'],
			orderBy: { startTime: 'ASC' },
		})

		return R.succeed(
			showtimes.map((s) => ({
				id: s.id,
				movieId: s.movie.id,
				movieTitle: s.movie.title,
				moviePosterUrl: s.movie.posterUrl ?? null,
				startTime: s.startTime,
				endTime: s.endTime,
			})),
		)
	}
}
