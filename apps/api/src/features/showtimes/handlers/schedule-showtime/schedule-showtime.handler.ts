import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { Auditorium } from '@/features/cinemas/domain/auditorium.entity.js'
import { Movie } from '@/features/movies/domain/movie.entity.js'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Showtime } from '../../domain/showtime.entity.js'

@Injectable()
export class ScheduleShowtimeHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['showtimes']['schedule']) {
		const movie = await this.em.findOne(Movie, { id: input.movieId })
		if (!movie) {
			return R.fail(new Error('Movie not found'))
		}

		const auditorium = await this.em.findOne(Auditorium, { id: input.auditoriumId })
		if (!auditorium) {
			return R.fail(new Error('Auditorium not found'))
		}

		// 1. Instantiate aggregate to compute slot boundaries and validate invariants
		const showtimeResult = Showtime.create({
			movie,
			auditorium,
			startTime: input.startTime,
			turnoverBufferMinutes: input.turnoverBufferMinutes,
		})

		if (R.isFailure(showtimeResult)) {
			return showtimeResult
		}

		const showtime = showtimeResult.value

		// 2. Overlap query check
		const conflictingSlot = await this.em.findOne(Showtime, {
			auditorium: auditorium.id,
			startTime: { $lt: showtime.endTime },
			endTime: { $gt: showtime.startTime },
		})

		if (conflictingSlot) {
			return R.fail(
				new Error(
					`Schedule conflict: Hall "${auditorium.name}" is already occupied between${conflictingSlot.startTime.toISOString()} and ${conflictingSlot.endTime.toISOString()}`,
				),
			)
		}

		// 3. Persist and return response DTO
		this.em.persist(showtime)
		await this.em.flush()

		return R.succeed({
			id: showtime.id,
			movieId: movie.id,
			auditoriumId: auditorium.id,
			startTime: showtime.startTime,
			endTime: showtime.endTime,
			createdAt: showtime.createdAt,
			updatedAt: showtime.updatedAt,
		})
	}
}
