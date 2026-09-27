import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { CommonModule } from './common/common.module.js'
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter.js'
import { CinemaModule } from './features/cinemas/cinema.module.js'
import { MoviesModule } from './features/movies/movies.module.js'

@Module({
	imports: [CommonModule, MoviesModule, CinemaModule],
	controllers: [AppController],
	providers: [AllExceptionsFilter, AppService],
})
export class AppModule {}
