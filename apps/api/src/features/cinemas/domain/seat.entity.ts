import { baseProperties } from '@/common/domain/base.properties.js'
import { defineEntity, p } from '@mikro-orm/core'
import { Result } from '@praha/byethrow'
import { v7 } from 'uuid'
import { Auditorium } from './auditorium.entity.js'
import { SeatType } from './cinema.types.js'

export const SeatSchema = defineEntity({
	name: 'Seat',
	tableName: 'seats',
	properties: {
		id: p.uuid().primary(),
		auditorium: () => p.manyToOne(Auditorium),
		row: p.string().length(5), // e.g. "A", "B", "VIP-1"
		number: p.integer(), // e.g. 1, 2, 3
		type: p.enum(() => SeatType).default(SeatType.REGULAR),
		...baseProperties,
	},
	uniques: [{ properties: ['auditorium', 'row', 'number'] }],
})

export class Seat extends SeatSchema.class {
	static create(props: { auditorium: Auditorium; row: string; number: number; type?: SeatType }) {
		if (props.number <= 0) {
			return Result.fail(new Error('Seat number must be greater than 0'))
		}

		const seat = new Seat()
		seat.id = v7()
		seat.auditorium = props.auditorium
		seat.row = props.row.trim().toUpperCase()
		seat.number = props.number
		seat.type = props.type ?? SeatType.REGULAR

		return Result.succeed(seat)
	}
}

SeatSchema.setClass(Seat)
