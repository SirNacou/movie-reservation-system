import { EntityManager, EntityRepository } from '@mikro-orm/core';
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
		private readonly em: EntityManager,
	) {}

	@Implement(contract.movies.list)
	list() {
		return implement(contract.movies.list).handler(async () => {
			this.em.findAll(Movie);
			const movies = await this.movieRepository.findAll();
			return movies.map((m) => ({ id: m.id, name: m.title }));
		});
	}
}
