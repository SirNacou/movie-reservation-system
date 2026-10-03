import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CinemasController } from './cinemas.controller.js'
import { Auditorium } from './domain/auditorium.entity.js'
import { Cinema } from './domain/cinema.entity.js'
import { Seat } from './domain/seat.entity.js'
import { ConfigureAuditoriumLayoutHandler } from './handlers/configure-auditorium-layout/configure-auditorium-layout.handler.js'
import { CreateAuditoriumHandler } from './handlers/create-auditorium/create-auditorium.handler.js'
import { CreateCinemaHandler } from './handlers/create-cinema/create-cinema.handler.js'
import { GetAuditoriumLayoutHandler } from './handlers/get-auditorium-layout/get-auditorium-layout.handler.js'
import { GetCinemaHandler } from './handlers/get-cinema/get-cinema.handler.js'
import { ListAuditoriumsHandler } from './handlers/list-auditoriums/list-auditoriums.handler.js'
import { ListCinemasHandler } from './handlers/list-cinemas/list-cinemas.handler.js'
import { RemoveCinemaHandler } from './handlers/remove-cinema/remove-cinema.handler.js'
import { UpdateCinemaHandler } from './handlers/update-cinema/update-cinema.handler.js'

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
		ListAuditoriumsHandler,
	],
	exports: [],
})
export class CinemasModule {}
