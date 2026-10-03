import { ApiInputs } from '@/common/infrastructure/orpc.js'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { R } from '@praha/byethrow'
import { Showtime } from '../../domain/showtime.entity.js'

@Injectable()
export class CancelShowtimeHandler {
	constructor(private readonly em: EntityManager) {}

	async handle(input: ApiInputs['showtimes']['cancel']) {
		const showtime = await this.em.findOne(Showtime, { id: input.id })

		if (!showtime) {
			return R.fail(new Error(`Showtime with ID ${input.id} not found`))
		}

		if (showtime.endTime <= new Date()) {
			return R.fail(new Error('Cannot cancel a showtime that has already ended'))
		}

		this.em.remove(showtime)
		await this.em.flush()

		return R.succeed({
			id: showtime.id,
			message: 'Showtime cancelled successfully',
		})
	}
}
