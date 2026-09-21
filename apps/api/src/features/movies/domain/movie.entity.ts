import { Result } from 'better-result';
import { EmptyMovieTitle } from './errors.js';
import { MovieId, newMovieId } from './movie.types.js';

export interface MovieProps {
	title: string;
	description: string;
}

export class Movie {
	public readonly id: MovieId;
	public readonly title: string;
	public readonly description: string;

	private constructor({ title, description }: MovieProps) {
		this.id = newMovieId();
		this.title = title;
		this.description = description;
	}

	public static create({
		title,
		description = '',
	}: {
		title: string;
		description: string;
	}): Result<Movie, EmptyMovieTitle> {
		title = title.trim();
		description = description.trim();
		if (title === '') return Result.err(new EmptyMovieTitle());

		return Result.ok(new Movie({ title, description }));
	}
}
