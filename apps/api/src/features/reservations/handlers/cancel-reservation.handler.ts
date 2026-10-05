import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager, LockMode } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Reservation } from '../domain/reservation.entity.js'

@Injectable()
export class CancelReservationHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(command: ApiInputs['reservations']['cancel']) {
		return this.em.transactional(async (em) => {
			const reservation = await em.findOne(
				Reservation,
				{ id: command.reservationId },
				{
					populate: ['showtime', 'seats', 'seats.seat'],
					lockMode: LockMode.PESSIMISTIC_WRITE,
				},
			)

			if (!reservation) {
				return R.fail(new Error('Reservation not found'))
			}

			const result = reservation.cancel()

			if (R.isFailure(result)) {
				return R.fail(result.error)
			}

			await em.flush()

			return R.succeed(reservation)
		})
	}
}
