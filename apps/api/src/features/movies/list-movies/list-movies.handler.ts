import { ApiOutputs } from '@/common/infrastructure/orpc.js'
import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Movie } from '../domain/movie.entity.js'

@Injectable()
export class ListMoviesHandler {
	constructor(
		@InjectRepository(Movie)
		private readonly moviesRepository: EntityRepository<Movie>,
	) {}
	async handle(): Promise<ApiOutputs['movies']['list']> {
		const movies = await this.moviesRepository.findAll()
		return movies.map((movie) => ({
			id: movie.id,
			title: movie.title,
			description: movie.description,
			poster_url: movie.posterUrl,
			duration_Minutes: movie.durationMinutes,
		}))
	}
}
