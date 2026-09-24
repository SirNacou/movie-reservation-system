import { Global, Module } from '@nestjs/common';
import { ORPCModule } from '@orpc/nest';
import { ConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { JobModule as JobsModule } from './jobs/jobs.module.js';

@Global()
@Module({
	imports: [ConfigModule, DatabaseModule, JobsModule, ORPCModule.forRoot({})],
	exports: [ConfigModule, DatabaseModule, JobsModule, ORPCModule],
})
export class InfrastructureModule {}
