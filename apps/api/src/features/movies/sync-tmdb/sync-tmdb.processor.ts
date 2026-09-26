import { EntityManager } from '@mikro-orm/core'
import { CreateRequestContext } from '@mikro-orm/decorators/legacy'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject, Logger } from '@nestjs/common'
import { Result } from '@praha/byethrow'
import { Job } from 'bullmq'
import { ENV_TOKEN } from '@/common/infrastructure/config/config.module.js'
import { type Env } from '@/env.js'
import { FailToCallTmdbApi } from '../domain/errors.js'
import { Movie } from '../domain/movie.entity.js'
import { TMDB_JOBS, TMDB_SYNC_QUEUE } from './sync-tmdb.constants.js'

@Processor(TMDB_SYNC_QUEUE, {
	limiter: {
		max: 20,
		duration: 1000,
	},
	concurrency: 5,
})
export class SyncTmdbProcessor extends WorkerHost {
	private readonly logger = new Logger(SyncTmdbProcessor.name)

	constructor(
		private readonly em: EntityManager,
		@Inject(ENV_TOKEN)
		private readonly envConfig: Env,
	) {
		super()
	}

	@CreateRequestContext((t: SyncTmdbProcessor) => t.em)
	async process(job: Job) {
		this.logger.log(`Received job ({job.id} of type){job.name}`)

		switch (job.name) {
			case TMDB_JOBS.IMPORT_MOVIE: {
				const res = await this.importMovie(job.data.tmdbId)
				if (res && Result.isFailure(res)) {
					throw new Error(String(res.error))
				}
				break
			}
			default:
				this.logger.warn(`Unhandled job name: ${job.name}`)
		}
	}

	private async importMovie(tmdbId: number) {
		const apiKey = this.envConfig.TMDB_API_KEY
		const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}`
		const res = await fetch(url, {
			headers: {
				Accept: 'application/json',
			},
		})

		if (!res.ok) {
			this.logger.error(`TMDB call failed for ID ${tmdbId}: ${res.status} ${res.statusText}`)
			if (res.status === 404) {
				return
			}
			return Result.fail(
				new FailToCallTmdbApi({ url, status: res.status, statusText: res.statusText }),
			)
		}

		const data = await res.json()

		// Check if the movie already exists
		const existingMovie = await this.em.findOne(Movie, { tmdbId })

		if (!existingMovie) {
			// Note: Map TMDB's snake_case properties to your entity inputs
			const movieResult = Movie.create({
				tmdbId,
				title: data.title,
				description: data.overview,
				posterUrl: data.poster_path ?? data.posterPath,
				durationMinutes: data.runtime ?? 0,
			})

			if (Result.isFailure(movieResult)) {
				this.logger.error(`Error creating movie ${tmdbId}: ${movieResult.error.join(', ')}`)
				return
			}

			// Unwrap the entity from the Result monad
			const createdMovie = movieResult.value
			this.em.persist(createdMovie)
		} else {
			existingMovie.title = data.title
			existingMovie.durationMinutes = data.runtime ?? existingMovie.durationMinutes
		}

		await this.em.flush()
		this.logger.log(`Successfully synced movie: ({data.title} (){data.id})`)
	}
}
