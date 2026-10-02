import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Auditorium } from '../../domain/auditorium.entity.js'
import { Seat } from '../../domain/seat.entity.js'

type Props = {
	req: ApiInputs['cinemas']['configureLayout']
}

@Injectable()
export class ConfigureAuditoriumLayoutHandler {
	constructor(private readonly em: EntityManager) {}

	async handle({ req }: Props) {
		return this.em.transactional(async (tx) => {
			const auditorium = await tx.findOne(Auditorium, { id: req.auditoriumId })
			if (!auditorium) {
				return R.fail(new Error('Auditorium not found'))
			}

			// 1. Delegate business logic and validation to the domain aggregate
			const layoutResult = auditorium.configureLayout(req.seats)
			if (R.isFailure(layoutResult)) {
				return layoutResult
			}

			const seats = layoutResult.value

			// 2. Persist the state change
			await tx.nativeDelete(Seat, { auditorium: auditorium.id })
			tx.persist(seats)
			await tx.flush()

			return R.succeed({
				auditoriumId: auditorium.id,
				totalSeats: auditorium.totalSeats,
				message: 'Auditorium layout configured successfully',
			})
		})
	}
}
