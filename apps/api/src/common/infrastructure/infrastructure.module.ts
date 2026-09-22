import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { ORPCModule } from '@orpc/nest';
import { JobModule as JobsModule } from './jobs/jobs.module.js';

@Global()
@Module({
	imports: [DatabaseModule, JobsModule, ORPCModule.forRoot({})],
	exports: [DatabaseModule, JobsModule, ORPCModule],
})
export class InfrastructureModule {}
