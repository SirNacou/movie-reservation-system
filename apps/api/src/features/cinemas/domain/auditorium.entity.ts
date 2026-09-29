import { baseProperties } from '@/common/domain/base.properties.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'
import { Cinema } from './cinema.entity.js'
import { Seat } from './seat.entity.js'

export const AuditoriumSchema = defineEntity({
	name: 'Auditorium',
	tableName: 'auditoriums',
	properties: {
		id: p.uuid().primary(),
		cinema: () => p.manyToOne(Cinema),
		name: p.string().length(100), // e.g. "Screen 1 - IMAX"
		totalSeats: p.integer().default(0),
		seats: () => p.oneToMany(Seat).mappedBy('auditorium').ref(),
		...baseProperties,
	},
})

export class Auditorium extends AuditoriumSchema.class {
	static create(props: { cinema: Cinema; name: string }) {
		const trimmedName = props.name.trim()
		if (!trimmedName) {
			return R.fail(new Error('Auditorium name cannot be empty'))
		}

		const hall = new Auditorium()
		hall.id = v7()
		hall.cinema = props.cinema
		hall.name = trimmedName
		hall.totalSeats = 0

		return R.succeed(hall)
	}

	updateTotalSeats(count: number): void {
		this.totalSeats = count
	}
}

AuditoriumSchema.setClass(Auditorium)
