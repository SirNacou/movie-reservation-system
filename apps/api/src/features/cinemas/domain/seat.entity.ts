import { baseProperties } from '@/common/domain/base.properties.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'
import { Auditorium } from './auditorium.entity.js'
import { SeatType } from './cinema.types.js'

export const SeatSchema = defineEntity({
	name: 'Seat',
	tableName: 'seats',
	properties: {
		id: p.uuid().primary(),
		auditorium: () => p.manyToOne(Auditorium),
		row: p.string().length(5),
		number: p.integer(),
		type: p.enum(() => SeatType).default(SeatType.REGULAR),
		...baseProperties,
	},
	uniques: [{ properties: ['auditorium', 'row', 'number'] }],
})

export class Seat extends SeatSchema.class {
	static create(props: { auditorium: Auditorium; row: string; number: number; type?: SeatType }) {
		const trimmedRow = props.row.trim().toUpperCase()
		if (!trimmedRow) {
			return R.fail(new Error('Seat row cannot be empty'))
		}

		if (props.number <= 0) {
			return R.fail(new Error('Seat number must be greater than 0'))
		}

		const seat = new Seat()
		seat.id = v7()
		seat.auditorium = props.auditorium
		seat.row = trimmedRow
		seat.number = props.number
		seat.type = props.type ?? SeatType.REGULAR

		return R.succeed(seat)
	}
}

SeatSchema.setClass(Seat)
