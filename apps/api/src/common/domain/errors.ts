import { ErrorFactory } from '@praha/error-factory';

export class ValidationError extends ErrorFactory({
	name: 'ValidationError',
	message: 'Invalid input provided',
}) {}
