import { Module } from '@nestjs/common'
import { CreateReservationHandler } from './handlers/create-reservation/create-reservation.handler.js'
import { ListShowtimeSeatsHandler } from './handlers/list-showtime-seats/list-showtime-seats.handler.js'
import { ReservationsController } from './reservations.controller.js'

@Module({
	providers: [CreateReservationHandler, ListShowtimeSeatsHandler],
	controllers: [ReservationsController],
})
export class ReservationsModule {}
