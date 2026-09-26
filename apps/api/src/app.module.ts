import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter.js'
import { InfrastructureModule } from './common/infrastructure/infrastructure.module.js'
import { MoviesModule } from './features/movies/movies.module.js'

@Module({
	imports: [InfrastructureModule, MoviesModule],
	controllers: [AppController],
	providers: [AllExceptionsFilter, AppService],
})
export class AppModule {}
