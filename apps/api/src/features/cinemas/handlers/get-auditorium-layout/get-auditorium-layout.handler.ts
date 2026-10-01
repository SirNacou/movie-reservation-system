import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { ApiInputs, ApiOutputs } from '@/common/infrastructure/orpc.js'
import { Auditorium } from '../../domain/auditorium.entity.js'

type Props = {
	req: ApiInputs['cinemas']['getLayout']
}

@Injectable()
export class GetAuditoriumLayoutHandler {
	constructor(
		@InjectRepository(Auditorium)
		private readonly auditoriumsRepository: EntityRepository<Auditorium>,
	) {}

	async handle({ req }: Props): Promise<R.Result<ApiOutputs['cinemas']['getLayout'], Error>> {
		const auditorium = await this.auditoriumsRepository.findOne(
			{ id: req.auditoriumId },
			{ populate: ['seats'] },
		)
		if (!auditorium) {
			return R.fail(new Error('Auditorium not found'))
		}

		return R.succeed({
			auditoriumId: auditorium.id,
			name: auditorium.name,
			totalSeats: auditorium.totalSeats,
			seats: auditorium.seats.getItems().map(({ id, row, number, type }) => ({
				id,
				row,
				number,
				type,
			})),
		})
	}
}
