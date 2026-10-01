import { ApiInputs, ApiOutputs } from '@/common/infrastructure/orpc.js'
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

	async handle({ req }: Props): Promise<R.Result<ApiOutputs['cinemas']['configureLayout'], Error>> {
		return this.em.transactional(async (tx) => {
			const auditorium = await tx.findOne(Auditorium, { id: req.auditoriumId })
			if (!auditorium) {
				return R.fail(new Error('Auditorium not found'))
			}

			const seats = req.seats.map((definition) =>
				Seat.create({
					auditorium,
					row: definition.row,
					number: definition.number,
					type: definition.type,
				}),
			)
			const invalidSeat = seats.find(R.isFailure)
			if (invalidSeat && R.isFailure(invalidSeat)) {
				return R.fail(invalidSeat.error)
			}

			await tx.nativeDelete(Seat, { auditorium: auditorium.id })
			for (const seatResult of seats) {
				if (R.isSuccess(seatResult)) tx.persist(seatResult.value)
			}

			auditorium.updateTotalSeats(seats.length)
			await tx.flush()

			return R.succeed({
				auditoriumId: auditorium.id,
				totalSeats: seats.length,
				message: 'Auditorium layout configured successfully',
			})
		})
	}
}
