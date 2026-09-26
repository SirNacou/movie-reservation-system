import { Global, Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ORPCModule } from '@orpc/nest'
import { AllExceptionsFilter } from '../filters/all-exceptions-filter.js'
import { ConfigModule } from './config/config.module.js'
import { DatabaseModule } from './database/database.module.js'
import { JobModule as JobsModule } from './jobs/jobs.module.js'

@Global()
@Module({
	imports: [ConfigModule, DatabaseModule, JobsModule, ORPCModule.forRoot({})],
	exports: [ConfigModule, DatabaseModule, JobsModule, ORPCModule],

	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class InfrastructureModule {}
