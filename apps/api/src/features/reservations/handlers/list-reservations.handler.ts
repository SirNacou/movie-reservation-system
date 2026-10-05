import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { Reservation } from '@/features/reservations/domain/reservation.entity.js'
import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'

@Injectable()
export class ListReservationsHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(command: ApiInputs['reservations']['list']) {
		const reservations = await this.em.find(
			Reservation,
			{
				customerEmail: command.customerEmail.trim().toLowerCase(),
			},
			{
				populate: [
					'showtime',
					'showtime.movie',
					'showtime.auditorium',
					'showtime.auditorium.cinema',
					'seats',
					'seats.seat',
				],
				orderBy: {
					createdAt: 'DESC',
				},
			},
		)

		return R.succeed(reservations)
	}
}
