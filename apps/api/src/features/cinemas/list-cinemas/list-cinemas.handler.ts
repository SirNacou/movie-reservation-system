import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ApiOutputs } from '@/common/infrastructure/orpc.js'
import { Cinema } from '../domain/cinema.entity.js'

@Injectable()
export class ListCinemasHandler {
	constructor(
		@InjectRepository(Cinema)
		private readonly cinemasRepository: EntityRepository<Cinema>,
	) {}
	async handle(): Promise<ApiOutputs['cinemas']['list']> {
		const cinemas = await this.cinemasRepository.findAll()

		return cinemas
	}
}
