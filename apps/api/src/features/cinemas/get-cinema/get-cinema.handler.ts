import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Cinema } from '../domain/cinema.entity.js'

@Injectable()
export class GetCinemaHandler {
	constructor(
		@InjectRepository(Cinema)
		private readonly cinemasRepository: EntityRepository<Cinema>,
	) {}
	async handle({ id }: { id: string }) {
		const res = await this.cinemasRepository.findOne(
			{
				id,
			},
			{ populate: ['auditoriums'] },
		)

		if (res === null) {
			return R.fail(new Error('Cinema not found'))
		}

		return R.succeed({
			id: res.id,
			name: res.name,
			city: res.city,
			address: res.address,
			auditoriums: res.auditoriums.getItems().map(({ id, name, totalSeats }) => ({
				id,
				name,
				totalSeats,
			})),
			createdAt: res.createdAt,
			updatedAt: res.updatedAt,
		})
	}
}
