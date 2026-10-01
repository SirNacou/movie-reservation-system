import { ApiInputs, ApiOutputs } from '@/common/infrastructure/orpc.js'
import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Cinema } from '../domain/cinema.entity.js'

type Props = {
	req: ApiInputs['cinemas']['update']
}

@Injectable()
export class UpdateCinemaHandler {
	constructor(
		@InjectRepository(Cinema)
		private readonly cinemasRepository: EntityRepository<Cinema>,
	) {}

	async handle({ req }: Props): Promise<R.Result<ApiOutputs['cinemas']['update'], Error>> {
		const cinema = await this.cinemasRepository.findOne({ id: req.id })
		if (!cinema) {
			return R.fail(new Error('Cinema not found'))
		}

		const updateResult = cinema.update({
			name: req.name,
			city: req.city,
			address: req.address,
		})

		if (R.isFailure(updateResult)) {
			return updateResult
		}

		this.cinemasRepository.nativeUpdate(
			{
				id: req.id,
			},
			{
				...updateResult.value,
			},
		)

		await this.cinemasRepository.getEntityManager().flush()

		return R.succeed({
			id: cinema.id,
			name: cinema.name,
			city: cinema.city,
			address: cinema.address,
		})
	}
}
