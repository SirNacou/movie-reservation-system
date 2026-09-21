import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';

@Global()
@Module({
	imports: [DatabaseModule],
	exports: [DatabaseModule],
})
export class InfrastructureModule {}
