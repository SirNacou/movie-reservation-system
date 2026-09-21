import { TaggedError } from 'better-result';

export class InvalidError extends TaggedError('InvalidError')<{
	input: string;
	message: string;
}> {}
