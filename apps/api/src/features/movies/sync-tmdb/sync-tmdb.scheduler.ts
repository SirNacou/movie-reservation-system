import { ENV_TOKEN } from '@/common/infrastructure/config/config.module.js';
import { type Env } from '@/env';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Result } from '@praha/byethrow';
import { BulkJobOptions, Queue } from 'bullmq';
import { FailToCallTmdbApi } from '../domain/errors.js';
import { ImportMovieJobPayload, TMDB_JOBS, TMDB_SYNC_QUEUE } from './sync-tmdb.constants.js';

@Injectable()
export class SyncTmdbScheduler {
	private readonly logger = new Logger(SyncTmdbScheduler.name);

	constructor(
		@InjectQueue(TMDB_SYNC_QUEUE)
		private readonly queue: Queue,
		@Inject(ENV_TOKEN)
		private readonly envConfig: Env,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_2AM)
	async handleNightlyAsync() {
		this.logger.log('Starting nightly TMDB sync job dispatch...');
		await this.dispatchTrendingMovies();
	}

	async dispatchTrendingMovies(page = 1) {
		const apiKey = this.envConfig.TMDB_API_KEY;
		const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
			},
		};

		const res = await fetch(url, options);
		if (!res.ok) {
			this.logger.error(`failed to call the api: ${url}, error: ${res}`);
			return Result.fail(
				new FailToCallTmdbApi({ url, status: res.status, statusText: res.statusText }),
			);
		}

		const data = await res.json();
		const movieIds: number[] = data.results.map((m: { id: number }) => m.id);

		const jobs = movieIds.map((tmdbId) => ({
			name: TMDB_JOBS.IMPORT_MOVIE,
			data: { tmdbId } as ImportMovieJobPayload,
			opts: {
				jobId: `tmdb-${tmdbId}`,
				removeOnComplete: true,
				removeOnFail: {
					count: 10,
				},
			} as BulkJobOptions,
		}));

		await this.queue.addBulk(jobs);
		this.logger.log(`Enqueued ${jobs.length} movies from page ${page}`);
	}
}
