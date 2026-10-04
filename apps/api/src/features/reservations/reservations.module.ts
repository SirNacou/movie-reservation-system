import { Module } from '@nestjs/common'
import { CreateReservationHandler } from './handlers/create-reservation/create-reservation.handler.js'

@Module({
	providers: [CreateReservationHandler],
})
export class ReservationsModule {}
