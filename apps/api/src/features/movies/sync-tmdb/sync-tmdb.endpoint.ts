import { Controller } from '@nestjs/common'
import { Implement } from '@orpc/nest'
import { implement, ORPCError } from '@orpc/server'
import { Result } from '@praha/byethrow'
import { contract } from '@repo/contract'
import { SyncTmdbScheduler } from './sync-tmdb.scheduler.js'

@Controller()
export class SyncTmdbEndpoint {
	constructor(private readonly scheduler: SyncTmdbScheduler) {}

	@Implement(contract.movies.syncTmdb)
	handle() {
		return implement(contract.movies.syncTmdb).handler(async ({ input: { page } }) => {
			const res = await this.scheduler.dispatchTrendingMovies(page)
			if (res && Result.isFailure(res)) {
				throw new ORPCError(res.error.cause as string)
			}
			return {
				message: `TMDB sync dispatched for page ${page}`,
			}
		})
	}
}
