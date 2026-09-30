import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CinemasController } from './cinema.controller.js'
import { ConfigureAuditoriumLayoutHandler } from './configure-auditorium-layout/configure-auditorium-layout.handler.js'
import { CreateAuditoriumHandler } from './create-auditorium/create-auditorium.handler.js'
import { CreateCinemaHandler } from './create-cinema/create-cinema.handler.js'
import { Auditorium } from './domain/auditorium.entity.js'
import { Cinema } from './domain/cinema.entity.js'
import { Seat } from './domain/seat.entity.js'
import { GetAuditoriumLayoutHandler } from './get-auditorium-layout/get-auditorium-layout.handler.js'
import { GetCinemaHandler } from './get-cinema/get-cinema.handler.js'
import { ListCinemasHandler } from './list-cinemas/list-cinemas.handler.js'
import { RemoveCinemaHandler } from './remove-cinema/remove-cinema.handler.js'
import { UpdateCinemaHandler } from './update-cinema/update-cinema.handler.js'

@Module({
	imports: [MikroOrmModule.forFeature([Cinema, Auditorium, Seat])],
	controllers: [CinemasController],
	providers: [
		CreateCinemaHandler,
		ListCinemasHandler,
		RemoveCinemaHandler,
		GetCinemaHandler,
		UpdateCinemaHandler,
		CreateAuditoriumHandler,
		ConfigureAuditoriumLayoutHandler,
		GetAuditoriumLayoutHandler,
	],
	exports: [],
})
export class CinemaModule {}
