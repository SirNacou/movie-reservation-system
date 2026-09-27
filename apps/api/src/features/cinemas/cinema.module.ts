import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CinemasController } from './cinema.controller.js'
import { CreateCinemaHandler } from './create-cinema/create-cinema.handler.js'
import { Cinema } from './domain/cinema.entity.js'
import { ListCinemasHandler } from './list-cinemas/list-cinemas.handler.js'

@Module({
	imports: [MikroOrmModule.forFeature([Cinema])],
	controllers: [CinemasController],
	providers: [CreateCinemaHandler, ListCinemasHandler],
	exports: [],
})
export class CinemaModule {}
