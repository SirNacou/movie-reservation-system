import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Reservation } from '../domain/reservation.entity.js'

@Injectable()
export class GetReservationHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['reservations']['get']) {
		const reservation = await this.em.findOne(
			Reservation,
			{ id: input.reservationId },
			{
				populate: [
					'showtime',
					'showtime.movie',
					'showtime.auditorium',
					'showtime.auditorium.cinema',
					'seats',
					'seats.seat',
				],
			},
		)

		if (!reservation) {
			return R.fail(new Error(`Reservation with ID ${input.reservationId} not found`))
		}

		return R.succeed({
			id: reservation.id,
			showtimeId: reservation.showtime.id,
			movieTitle: reservation.showtime.movie.title,
			cinemaName: reservation.showtime.auditorium.cinema.name,
			auditoriumName: reservation.showtime.auditorium.name,
			startTime: reservation.showtime.startTime,
			endTime: reservation.showtime.endTime,
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
		})
	}
}
