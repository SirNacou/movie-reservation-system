import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { ApiInputs, ApiOutputs } from '@/common/infrastructure/orpc.js'
import { Cinema } from '../../domain/cinema.entity.js'

type Props = {
	req: ApiInputs['cinemas']['create']
}

@Injectable()
export class CreateCinemaHandler {
	constructor(private readonly em: EntityManager) {}
	async handle({ req }: Props): Promise<R.Result<ApiOutputs['cinemas']['create'], Error[]>> {
		const cinemaResult = Cinema.create({ name: req.name, city: req.city, address: req.address })

		if (R.isFailure(cinemaResult)) {
			return cinemaResult
		}
		this.em.persist(cinemaResult.value)
		await this.em.flush()

		return cinemaResult
	}
}
