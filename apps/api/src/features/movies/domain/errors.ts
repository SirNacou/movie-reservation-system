import { ValidationError } from '@/common/domain/errors.js';

export type MovieError = EmptyMovieTitleError | InvalidMovieDurationError | InvalidMovieId;

export class EmptyMovieTitleError extends ValidationError {
	cause: "Title can't be empty.";
}

export class InvalidMovieDurationError extends ValidationError {
	constructor(readonly duration: number) {
		super({
			cause: `Movie duration must be greater than 0 minutes. Received: ${duration}`,
		});
	}
}

export class InvalidMovieId extends ValidationError {
	cause: 'Invalid Movie Id';
}
