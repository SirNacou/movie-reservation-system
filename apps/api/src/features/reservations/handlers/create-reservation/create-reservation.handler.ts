import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { Seat } from '@/features/cinemas/domain/seat.entity.js'
import { Showtime } from '@/features/showtimes/domain/showtime.entity.js'
import { EntityManager, LockMode } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { ReservationSeat } from '../../domain/reservation-seat.entity.js'
import { Reservation } from '../../domain/reservation.entity.js'
import { ReservationStatus } from '../../domain/reservation.types.js'

@Injectable()
export class CreateReservationHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(command: ApiInputs['reservations']['create']) {
		const uniqueSeatIds = new Set(command.seatIds)

		if (uniqueSeatIds.size !== command.seatIds.length) {
			return R.fail(new Error('Duplicate seats detected'))
		}

		return this.em.transactional(async (em) => {
			const showtime = await em.findOne(
				Showtime,
				{ id: command.showtimeId },
				{
					populate: ['auditorium'],
				},
			)

			if (!showtime) {
				return R.fail(new Error('Showtime not found'))
			}

			// Lock the seat rows.
			const seats = await em.find(
				Seat,
				{
					id: { $in: command.seatIds },
				},
				{
					populate: ['auditorium'],
					lockMode: LockMode.PESSIMISTIC_WRITE,
				},
			)

			if (seats.length !== command.seatIds.length) {
				return R.fail(new Error('One or more seats were not found'))
			}

			const reservationResult = Reservation.create({
				showtime,
				customerEmail: command.customerEmail,
				customerName: command.customerName,
				seats,
			})

			if (R.isFailure(reservationResult)) {
				return reservationResult
			}

			const reservation = reservationResult.value

			const existingSeats = await em.find(ReservationSeat, {
				seat: { $in: command.seatIds },
				reservation: {
					showtime: showtime.id,
					status: {
						$in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
					},
				},
			})

			if (existingSeats.length > 0) {
				const reservedSeatIds = new Set(
					existingSeats.map((reservationSeat) => reservationSeat.seat.id),
				)

				const unavailableSeatIds = command.seatIds.filter((id) => reservedSeatIds.has(id))

				return R.fail(new Error(`Seats are already reserved: ${unavailableSeatIds.join(', ')}`))
			}

			em.persist(reservation)

			await em.flush()

			return R.succeed(reservation)
		})
	}
}
