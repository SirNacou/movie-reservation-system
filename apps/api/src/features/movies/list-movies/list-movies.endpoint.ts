import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Controller } from '@nestjs/common';
import { Implement } from '@orpc/nest';
import { implement } from '@orpc/server';
import { contract } from '@repo/contract';
import { Movie } from '../domain/movie.entity.js';

@Controller()
export class ListMoviesEndpoint {
	constructor(
		@InjectRepository(Movie)
		private readonly movieRepository: EntityRepository<Movie>,
	) {}

	@Implement(contract.movies.list)
	handle() {
		return implement(contract.movies.list).handler(async () => {
			const movies = await this.movieRepository.findAll();
			return movies.map((m) => ({ id: m.id, name: m.title }));
		});
	}
}
