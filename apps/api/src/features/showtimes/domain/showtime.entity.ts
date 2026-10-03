import { baseProperties } from '@/common/domain/base.properties.js'
import { Auditorium } from '@/features/cinemas/domain/auditorium.entity.js'
import { Movie } from '@/features/movies/domain/movie.entity.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'

export interface CreateShowtimeProps {
	movie: Movie
	auditorium: Auditorium
	startTime: Date
	turnoverBufferMinutes?: number
}

export const ShowtimeSchema = defineEntity({
	name: 'Showtime',
	tableName: 'showtimes',
	properties: {
		id: p.uuid().primary(),
		movie: () => p.manyToOne(() => Movie),
		auditorium: () => p.manyToOne(() => Auditorium),
		startTime: p.datetime(),
		endTime: p.datetime(),
		...baseProperties,
	},
	indexes: [
		{ properties: ['auditorium', 'startTime', 'endTime'] },
		{ properties: ['movie', 'startTime'] },
	],
})

export class Showtime extends ShowtimeSchema.class {
	public static create({
		movie,
		auditorium,
		startTime,
		turnoverBufferMinutes = 15,
	}: CreateShowtimeProps) {
		const now = new Date()

		if (startTime <= now) {
			return R.fail(new Error('Cannot schedule a showtime in the past'))
		}

		if (!movie.durationMinutes || movie.durationMinutes <= 0) {
			return R.fail(new Error('Associated movie has an invalid or unset runtime'))
		}

		// endTime = startTime + movieDuration + turnoverBuffer
		const totalSlotMinutes = movie.durationMinutes + turnoverBufferMinutes
		const endTime = new Date(startTime.getTime() + totalSlotMinutes * 60 * 1000)

		const showtime = new Showtime()
		showtime.id = v7()
		showtime.movie = movie
		showtime.auditorium = auditorium
		showtime.startTime = startTime
		showtime.endTime = endTime

		return R.succeed(showtime)
	}
}

ShowtimeSchema.setClass(Showtime)
