import { MikroOrmModule } from '@mikro-orm/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { Movie } from './domain/movie.entity.js'
import { ListMoviesHandler } from './list-movies/list-movies.handler.js'
import { MoviesController } from './movies.controller.js'
import { TMDB_SYNC_QUEUE } from './sync-tmdb/sync-tmdb.constants.js'
import { SyncTmdbHandler } from './sync-tmdb/sync-tmdb.handler.js'
import { SyncTmdbProcessor } from './sync-tmdb/sync-tmdb.processor.js'
import { SyncTmdbScheduler } from './sync-tmdb/sync-tmdb.scheduler.js'

@Module({
	imports: [
		MikroOrmModule.forFeature([Movie]),
		BullModule.registerQueue({
			name: TMDB_SYNC_QUEUE,
		}),
	],
	providers: [SyncTmdbScheduler, SyncTmdbProcessor, ListMoviesHandler, SyncTmdbHandler],
	controllers: [MoviesController],
	exports: [SyncTmdbScheduler],
})
export class MoviesModule {}
