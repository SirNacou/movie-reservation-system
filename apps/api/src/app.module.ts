import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { InfrastructureModule } from './common/infrastructure/infrastructure.module.js';
import { MoviesModule } from './features/movies/movies.module.js';

@Module({
	imports: [InfrastructureModule, MoviesModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
