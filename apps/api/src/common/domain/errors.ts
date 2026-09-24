import { ErrorFactory } from '@praha/error-factory';

export class ValidationError extends ErrorFactory({
	name: 'ValidationError',
	message: 'Invalid input provided',
}) {}

export class HttpError extends ErrorFactory({
	name: 'HttpError',
	message: 'Failed to call HTTP',
	fields: ErrorFactory.fields<{ url: string }>(),
}) {}
