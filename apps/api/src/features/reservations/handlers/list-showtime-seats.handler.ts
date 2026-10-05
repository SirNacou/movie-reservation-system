import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { Seat } from '@/features/cinemas/domain/seat.entity.js'
import { ReservationSeat } from '@/features/reservations/domain/reservation-seat.entity.js'
import { ReservationStatus } from '@/features/reservations/domain/reservation.types.js'
import { Showtime } from '@/features/showtimes/domain/showtime.entity.js'
import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'

@Injectable()
export class ListShowtimeSeatsHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(command: ApiInputs['reservations']['listShowtimeSeats']) {
		const showtime = await this.em.findOne(
			Showtime,
			{ id: command.showtimeId },
			{
				populate: ['auditorium'],
			},
		)

		if (!showtime) {
			return R.fail(new Error('Showtime not found'))
		}

		const seats = await this.em.find(Seat, {
			auditorium: showtime.auditorium.id,
		})

		const reservedSeats = await this.em.find(ReservationSeat, {
			seat: {
				auditorium: showtime.auditorium.id,
			},
			reservation: {
				showtime: showtime.id,
				status: {
					$in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
				},
			},
		})

		const reservedSeatIds = new Set(reservedSeats.map((reservationSeat) => reservationSeat.seat.id))

		return R.succeed(
			seats.map((seat) => ({
				id: seat.id,
				row: seat.row,
				number: seat.number,
				status: reservedSeatIds.has(seat.id) ? ('RESERVED' as const) : ('AVAILABLE' as const),
			})),
		)
	}
}
