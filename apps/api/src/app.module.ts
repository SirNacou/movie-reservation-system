import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { CommonModule } from './common/common.module.js'
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter.js'
import { CinemasModule } from './features/cinemas/cinemas.module.js'
import { MoviesModule } from './features/movies/movies.module.js'
import { ShowtimesModule } from './features/showtimes/showtimes.module.js'

@Module({
	imports: [CommonModule, MoviesModule, CinemasModule, ShowtimesModule],
	controllers: [AppController],
	providers: [AllExceptionsFilter, AppService],
})
export class AppModule {}
