import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager, type FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Showtime } from '../../domain/showtime.entity.js'

@Injectable()
export class ListShowtimesHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['showtimes']['list']) {
		const where: FilterQuery<Showtime> = {
			...(input.movieId && { movie: input.movieId }),
			...(input.cinemaId && { auditorium: { cinema: input.cinemaId } }),
			...((input.from || input.to) && {
				startTime: {
					...(input.from && { $gte: input.from }),
					...(input.to && { $lt: input.to }),
				},
			}),
		}

		const showtimes = await this.em.find(Showtime, where, {
			// Only select the columns the response needs
			fields: [
				'id',
				'startTime',
				'endTime',
				'movie.id',
				'movie.title',
				'movie.durationMinutes',
				'auditorium.id',
				'auditorium.name',
				'auditorium.cinema.id',
				'auditorium.cinema.name',
			],
			// One query with JOINs instead of one query per relation level
			strategy: 'joined',
			orderBy: { startTime: 'ASC' },
			// Read-only endpoint: skip identity map / change tracking overhead
			disableIdentityMap: true,
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
