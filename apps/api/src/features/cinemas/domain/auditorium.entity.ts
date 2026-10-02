import { baseProperties } from '@/common/domain/base.properties.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'
import { Cinema } from './cinema.entity.js'
import { SeatType } from './cinema.types.js'
import { Seat } from './seat.entity.js'

export type SeatDefinitionInput = {
	row: string
	number: number
	type?: SeatType
}

export const AuditoriumSchema = defineEntity({
	name: 'Auditorium',
	tableName: 'auditoriums',
	properties: {
		id: p.uuid().primary(),
		cinema: () => p.manyToOne(Cinema),
		name: p.string().length(100),
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

	/**
	 * Reconfigures the auditorium layout.
	 * Enforces seat coordinate uniqueness and maintains `totalSeats`.
	 */
	configureLayout(definitions: SeatDefinitionInput[]) {
		if (definitions.length === 0) {
			return R.fail(new Error('Auditorium must contain at least one seat'))
		}

		const seenCoordinates = new Set()
		const newSeats: Seat[] = []

		for (const def of definitions) {
			const seatResult = Seat.create({
				auditorium: this,
				row: def.row,
				number: def.number,
				type: def.type,
			})

			if (R.isFailure(seatResult)) {
				return seatResult
			}

			const seat = seatResult.value
			const coordinateKey = `${seat.row}-${seat.number}`

			if (seenCoordinates.has(coordinateKey)) {
				return R.fail(new Error(`Duplicate seat coordinate: ${seat.row}-${seat.number}`))
			}

			seenCoordinates.add(coordinateKey)
			newSeats.push(seat)
		}

		// Aggregate invariant: totalSeats always matches the layout
		this.totalSeats = newSeats.length

		return R.succeed(newSeats)
	}
}

AuditoriumSchema.setClass(Auditorium)
