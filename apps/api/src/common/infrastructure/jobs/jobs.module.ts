import env from '@/env.js';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

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
	],
	exports: [BullModule],
})
export class JobModule {}
