import { isValidUuidV7 } from '@/common/domain/uuidv7.js'
import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Cinema } from '../domain/cinema.entity.js'

@Injectable()
export class RemoveCinemaHandler {
	constructor(
		@InjectRepository(Cinema)
		private readonly cinemasRepository: EntityRepository<Cinema>,
	) {}

	async handle({ id }: { id: string }) {
		if (!isValidUuidV7(id)) {
			return R.fail(
				new Error('BAD_REQUEST', {
					cause: 'Wrong cinema id',
				}),
			)
		}

		await this.cinemasRepository.nativeDelete({
			id: id,
		})

		return R.succeed()
	}
}
