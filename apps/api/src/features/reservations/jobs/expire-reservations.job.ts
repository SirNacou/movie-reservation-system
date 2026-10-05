import { Reservation } from '@/features/reservations/domain/reservation.entity.js'
import { ReservationStatus } from '@/features/reservations/domain/reservation.types.js'
import { EntityManager } from '@mikro-orm/core'
import { CreateRequestContext } from '@mikro-orm/decorators/legacy'
import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { R } from '@praha/byethrow'

@Injectable()
export class ExpireReservationsJob {
	private readonly logger = new Logger(ExpireReservationsJob.name)

	constructor(private readonly em: EntityManager) {}

	@Cron('*/30 * * * * *')
	@CreateRequestContext()
	async handle() {
		const reservations = await this.em.find(Reservation, {
			status: ReservationStatus.PENDING,
			expiresAt: {
				$lte: new Date(),
			},
		})

		if (reservations.length === 0) {
			return
		}

		for (const reservation of reservations) {
			const result = reservation.expire()

			if (R.isFailure(result)) {
				this.logger.warn(`Failed to expire reservation ${reservation.id}: ${result.error.message}`)
			}
		}

		await this.em.flush()

		this.logger.log(`Expired ${reservations.length} reservation(s)`)
	}
}
