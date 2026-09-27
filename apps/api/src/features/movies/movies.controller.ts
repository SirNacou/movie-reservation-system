import { Controller, Inject } from '@nestjs/common'
import { Implement } from '@orpc/nest'
import { implement, ORPCError } from '@orpc/server'
import { R } from '@praha/byethrow'
import { contract } from '@repo/contract'
import { ListMoviesHandler } from './list-movies/list-movies.handler.js'
import { SyncTmdbHandler } from './sync-tmdb/sync-tmdb.handler.js'

@Controller()
export class MoviesController {
	constructor(
		@Inject(ListMoviesHandler)
		private readonly listMoviesHandler: ListMoviesHandler,
		@Inject(SyncTmdbHandler)
		private readonly syncTmdbHandler: SyncTmdbHandler,
	) {}

	@Implement(contract.movies)
	movies() {
		return {
			list: implement(contract.movies.list).handler(() => this.listMoviesHandler.handle()),
			syncTmdb: implement(contract.movies.syncTmdb).handler(async ({ input }) => {
				const res = await this.syncTmdbHandler.handle({ req: input })
				if (res && R.isFailure(res)) {
					throw new ORPCError(res.error.cause as string)
				}
				return {
					message: `TMDB sync dispatched for page ${input.page}`,
				}
			}),
		}
	}
}
