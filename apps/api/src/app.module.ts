import { Module } from '@nestjs/common';
import { ORPCModule } from '@orpc/nest';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MoviesModule } from './features/movies/movies.module.js';
import { InfrastructureModule } from './common/infrastructure/infrastructure.module.js'

@Module({
	imports: [InfrastructureModule, MoviesModule, ORPCModule.forRoot({})],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
