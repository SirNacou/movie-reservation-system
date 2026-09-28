import { env } from '@/env.js'
import mikroOrmConfig from '@/mikro-orm.config.js'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ORPCModule } from '@orpc/nest'
import { AllExceptionsFilter } from './filters/all-exceptions-filter.js'
import { ENV_TOKEN } from './infrastructure/config/env.config.js'

@Global()
@Module({
	imports: [
		ScheduleModule.forRoot(),
		BullModule.forRoot({
			connection: {
				host: env.REDIS_HOST,
				port: env.REDIS_PORT,
			},
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: 'exponential',
					delay: 2000,
					jitter: 1,
				},
				removeOnComplete: 100,
				removeOnFail: 500,
			},
		}),
		ORPCModule.forRoot({}),
		MikroOrmModule.forRoot(mikroOrmConfig),
	],
	providers: [
		{
			provide: ENV_TOKEN,
			useValue: env,
		},
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
	exports: [BullModule, ORPCModule, ENV_TOKEN],
})
export class CommonModule {}
