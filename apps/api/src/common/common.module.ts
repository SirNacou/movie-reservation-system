import { MikroOrmModule } from '@mikro-orm/nestjs'
import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ORPCModule } from '@orpc/nest'
import { createMikroOrmOptions } from '@/common/infrastructure/config/mikro-orm.options.js'
import { AllExceptionsFilter } from './filters/all-exceptions-filter.js'
import { type Environment, validateEnvironment } from './infrastructure/config/env.config.js'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: validateEnvironment,
		}),
		ScheduleModule.forRoot(),
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Environment, true>) => ({
				connection: {
					host: config.getOrThrow('REDIS_HOST'),
					port: config.getOrThrow('REDIS_PORT'),
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
		}),
		ORPCModule.forRoot({}),
		MikroOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Environment, true>) =>
				createMikroOrmOptions({
					DATABASE_URL: config.getOrThrow('DATABASE_URL'),
					NODE_ENV: config.getOrThrow('NODE_ENV'),
				}),
		}),
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
	exports: [BullModule, ORPCModule],
})
export class CommonModule {}
