import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { Movie } from './domain/movie.entity.js';
import { ListMoviesEndpoint } from './list-movies/list-movies.endpoint.js';
import { TMDB_SYNC_QUEUE } from './sync-tmdb/sync-tmdb.constants.js';
import { SyncTmdbEndpoint } from './sync-tmdb/sync-tmdb.endpoint.js';
import { SyncTmdbProcessor } from './sync-tmdb/sync-tmdb.processor.js';
import { SyncTmdbScheduler } from './sync-tmdb/sync-tmdb.scheduler.js';

@Module({
	imports: [
		MikroOrmModule.forFeature([Movie]),
		BullModule.registerQueue({
			name: TMDB_SYNC_QUEUE,
		}),
	],
	providers: [SyncTmdbScheduler, SyncTmdbProcessor],
	controllers: [ListMoviesEndpoint, SyncTmdbEndpoint],
	exports: [SyncTmdbScheduler],
})
export class MoviesModule {}
