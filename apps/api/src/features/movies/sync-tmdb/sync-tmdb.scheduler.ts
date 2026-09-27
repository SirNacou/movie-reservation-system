import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { R } from '@praha/byethrow'
import { SyncTmdbHandler } from './sync-tmdb.handler.js'

@Injectable()
export class SyncTmdbScheduler {
	private readonly logger = new Logger(SyncTmdbScheduler.name)

	constructor(private readonly syncTmdbHandler: SyncTmdbHandler) {}

	@Cron(CronExpression.EVERY_DAY_AT_2AM)
	async handleNightlyAsync() {
		this.logger.log('Starting nightly TMDB sync job dispatch...')
		const res = await this.syncTmdbHandler.handle({
			req: {
				page: 1,
			},
		})
		if (res && R.isFailure(res)) {
			this.logger.error(`Failed to sync TMDB movies: ${res.error.message}`)
		}
	}
}
