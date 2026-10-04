import { Controller } from '@nestjs/common'
import { Implement } from '@orpc/nest'
import { implement, ORPCError } from '@orpc/server'
import { R } from '@praha/byethrow'
import { contract } from '@repo/contract'
import { CreateReservationHandler } from './handlers/create-reservation/create-reservation.handler.js'
import { ListShowtimeSeatsHandler } from './handlers/list-showtime-seats/list-showtime-seats.handler.js'

@Controller()
export class ReservationsController {
	constructor(
		private readonly createReservationHandler: CreateReservationHandler,
		private readonly listShowtimeSeatsHandler: ListShowtimeSeatsHandler,
	) {}

	@Implement(contract.reservations)
	reservations() {
		return {
			create: implement(contract.reservations.create).handler(async ({ input }) => {
				const res = await this.createReservationHandler.handle(input)
				if (R.isFailure(res)) {
					throw new ORPCError('BAD_REQUEST', res.error)
				}

				const reservation = res.value

				return {
					id: reservation.id,
					showtimeId: reservation.showtime.id,
					customerEmail: reservation.customerEmail,
					customerName: reservation.customerName ?? null,
					status: reservation.status,
					expiresAt: reservation.expiresAt,
					seats: reservation.seats.getItems().map((reservationSeat) => ({
						id: reservationSeat.id,
						seatId: reservationSeat.seat.id,
						row: reservationSeat.seat.row,
						number: reservationSeat.seat.number,
					})),
					createdAt: reservation.createdAt,
					updatedAt: reservation.updatedAt,
				}
			}),
			listShowtimeSeats: implement(contract.reservations.listShowtimeSeats).handler(
				async ({ input }) => {
					const res = await this.listShowtimeSeatsHandler.handle(input)

					if (R.isFailure(res)) {
						throw new ORPCError('BAD_REQUEST', res.error)
					}

					return res.value
				},
			),
		}
	}
}
