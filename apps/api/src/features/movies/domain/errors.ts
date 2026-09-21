import { TaggedError } from 'better-result';

export class EmptyMovieTitle extends TaggedError('EmptyMovieTitle')<{
	message: string;
}> {
	constructor() {
		super({
			message: "Movie title can't be empty",
		});
	}
}

export class InvalidMovieId extends TaggedError('InvalidMovieId')<{
	input: string;
	message: string;
}> {
	/**
	 *
	 */
	constructor(input: string) {
		super({
			input,
			message: `${input} is not a MovieId`,
		});
	}
}
