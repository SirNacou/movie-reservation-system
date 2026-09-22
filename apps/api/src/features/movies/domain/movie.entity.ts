import { defineEntity, p } from '@mikro-orm/core';
import { Result } from '@praha/byethrow';
import { EmptyMovieTitleError, InvalidMovieDurationError, MovieError } from './errors.js';
import { MovieId, MovieIdType, newMovieId } from './movie.types.js';

export interface CreateMovieInput {
	title: string;
	description: string;
	durationMinutes: number;
	posterUrl: string;
}

export interface MovieProps {
	id: MovieId;
	title: string;
	description: string;
	durationMinutes: number;
	posterUrl: string;
}

export const MovieSchema = defineEntity({
	name: 'Movie',
	tableName: 'movies',
	properties: {
		id: p.type(MovieIdType).primary(),
		title: p.string(),
		description: p.text(),
		durationMinutes: p.integer(),
		posterUrl: p.text(),
	},
});

export class Movie extends MovieSchema.class {
	public static create({ title, description = '', durationMinutes, posterUrl }: CreateMovieInput) {
		title = title.trim();
		description = description.trim();

		const errors: MovieError[] = [];

		if (title === '') {
			errors.push(new EmptyMovieTitleError());
		}
		if (durationMinutes < 0) {
			errors.push(new InvalidMovieDurationError(durationMinutes));
		}

		if (errors.length > 0) return Result.fail(errors);

		const movie = new Movie();
		movie.id = newMovieId();
		movie.title = title;
		movie.description = description;
		movie.durationMinutes = durationMinutes;
		movie.posterUrl = posterUrl;

		return Result.succeed(movie);
	}
}

MovieSchema.setClass(Movie);
