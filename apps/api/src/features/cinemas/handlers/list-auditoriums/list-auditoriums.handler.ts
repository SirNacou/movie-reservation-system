import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager, type FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Auditorium } from '../../domain/auditorium.entity.js'

@Injectable()
export class ListAuditoriumsHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['cinemas']['listAuditoriums']) {
		const filter: FilterQuery<NoInfer<Auditorium>> = {}

		if (input.cinemaId) {
			filter.cinema = input.cinemaId
		}

		const auditoriums = await this.em.find(Auditorium, filter, {
			populate: ['cinema'],
			orderBy: { name: 'ASC' },
		})

		return R.succeed(
			auditoriums.map((auditorium) => ({
				id: auditorium.id,
				cinemaId: auditorium.cinema.id,
				cinemaName: auditorium.cinema.name,
				name: auditorium.name,
				totalSeats: auditorium.totalSeats,
			})),
		)
	}
}
