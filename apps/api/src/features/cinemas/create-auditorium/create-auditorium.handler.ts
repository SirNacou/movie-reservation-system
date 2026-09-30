import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { ApiInputs, ApiOutputs } from '@/common/infrastructure/orpc.js'
import { Auditorium } from '../domain/auditorium.entity.js'
import { Cinema } from '../domain/cinema.entity.js'

type Props = {
	req: ApiInputs['cinemas']['createAuditorium']
}

@Injectable()
export class CreateAuditoriumHandler {
	constructor(
		@InjectRepository(Auditorium)
		private readonly auditoriumsRepository: EntityRepository<Auditorium>,
		@InjectRepository(Cinema)
		private readonly cinemasRepository: EntityRepository<Cinema>,
	) {}

	async handle({ req }: Props): Promise<R.Result<ApiOutputs['cinemas']['createAuditorium'], Error>> {
		const cinema = await this.cinemasRepository.findOne({ id: req.cinemaId })
		if (!cinema) {
			return R.fail(new Error('Cinema not found'))
		}

		const auditoriumResult = Auditorium.create({ cinema, name: req.name })
		if (R.isFailure(auditoriumResult)) {
			return auditoriumResult
		}

		const auditorium = auditoriumResult.value
		this.auditoriumsRepository.getEntityManager().persist(auditorium)
		await this.auditoriumsRepository.getEntityManager().flush()

		return R.succeed({
			id: auditorium.id,
			cinemaId: cinema.id,
			name: auditorium.name,
			totalSeats: auditorium.totalSeats,
		})
	}
}
