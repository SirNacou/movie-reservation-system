import { Module } from '@nestjs/common'
import { CancelReservationHandler } from './handlers/cancel-reservation.handler.js'
import { ConfirmReservationHandler } from './handlers/confirm-reservation.handler.js'
import { CreateReservationHandler } from './handlers/create-reservation.handler.js'
import { GetReservationHandler } from './handlers/get-reservation.handler.js'
import { ListShowtimeSeatsHandler } from './handlers/list-showtime-seats.handler.js'
import { ExpireReservationsJob } from './jobs/expire-reservations.job.js'
import { ReservationsController } from './reservations.controller.js'

@Module({
	providers: [
		CreateReservationHandler,
		GetReservationHandler,
		ListShowtimeSeatsHandler,
		ConfirmReservationHandler,
		CancelReservationHandler,
		ExpireReservationsJob,
	],
	controllers: [ReservationsController],
})
export class ReservationsModule {}
