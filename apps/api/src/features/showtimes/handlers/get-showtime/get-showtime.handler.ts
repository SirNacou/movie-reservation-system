import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Showtime } from '../../domain/showtime.entity.js'

@Injectable()
export class GetShowtimeHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['showtimes']['get']) {
		const showtime = await this.em.findOne(
			Showtime,
			{ id: input.id },
			{ populate: ['movie', 'auditorium', 'auditorium.cinema'] },
		)

		if (!showtime) {
			return R.fail(new Error(`Showtime with ID ${input.id} not found`))
		}

		return R.succeed({
			id: showtime.id,
			movieId: showtime.movie.id,
			movieTitle: showtime.movie.title,
			moviePosterUrl: showtime.movie.posterUrl ?? null,
			durationMinutes: showtime.movie.durationMinutes,
			auditoriumId: showtime.auditorium.id,
			auditoriumName: showtime.auditorium.name,
			cinemaId: showtime.auditorium.cinema.id,
			cinemaName: showtime.auditorium.cinema.name,
			startTime: showtime.startTime,
			endTime: showtime.endTime,
			totalSeats: showtime.auditorium.totalSeats,
		})
	}
}
