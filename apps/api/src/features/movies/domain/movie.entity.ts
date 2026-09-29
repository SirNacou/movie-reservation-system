import { baseProperties } from '@/common/domain/base.properties.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'
import { EmptyMovieTitleError, InvalidMovieDurationError, MovieError } from './errors.js'

export type CreateMovieInput = {
	title: string
	tmdbId: number
	description: string
	durationMinutes: number
	posterUrl: string
}

export const MovieSchema = defineEntity({
	name: 'Movie',
	tableName: 'movies',
	properties: {
		id: p.uuid().primary(),
		tmdbId: p.integer(),
		title: p.string(),
		description: p.text(),
		durationMinutes: p.integer(),
		posterUrl: p.text(),
		...baseProperties,
	},
})

export class Movie extends MovieSchema.class {
	public static create({
		tmdbId,
		title,
		description = '',
		durationMinutes,
		posterUrl,
	}: CreateMovieInput) {
		title = title.trim()
		description = description.trim()

		const errors: MovieError[] = []

		if (title === '') {
			errors.push(new EmptyMovieTitleError())
		}
		if (durationMinutes < 0) {
			errors.push(new InvalidMovieDurationError(durationMinutes))
		}

		if (errors.length > 0) return R.fail(errors)

		const movie = new Movie()
		movie.id = v7()
		movie.tmdbId = tmdbId
		movie.title = title
		movie.description = description
		movie.durationMinutes = durationMinutes
		movie.posterUrl = posterUrl

		return R.succeed(movie)
	}
}

MovieSchema.setClass(Movie)
