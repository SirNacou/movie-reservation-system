import { Result } from 'better-result';
import { InvalidMovieId } from './errors.js';
import { isValidUuidV7 } from '../../../common/domain/uuidv7.js';
import { v7 } from 'uuid';

export type MovieId = string & { readonly __brand: unique symbol };
export const newMovieId = () => v7() as MovieId;
export const toMovieId = (id: string): Result<MovieId, InvalidMovieId> => {
	return isValidUuidV7(id) ? Result.ok(id as MovieId) : Result.err(new InvalidMovieId(id));
};
