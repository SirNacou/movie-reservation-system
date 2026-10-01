import { baseProperties } from '@/common/domain/base.properties.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'
import { Auditorium } from './auditorium.entity.js'

export type CreateCinemaInput = {
	name: string
	city: string
	address: string
}

export const CinemaSchema = defineEntity({
	name: 'Cinema',
	tableName: 'cinemas',
	properties: {
		id: p.uuid().primary(),
		name: p.string().length(255),
		city: p.string().length(100),
		address: p.text(),
		auditoriums: () => p.oneToMany(Auditorium).mappedBy('cinema').ref(),
		...baseProperties,
	},
})

export class Cinema extends CinemaSchema.class {
	public static create({ name, city, address }: CreateCinemaInput) {
		name = name.trim()
		city = city.trim()
		address = address.trim()

		const errors: Error[] = []
		if (name === '') {
			errors.push(new Error("Name can't be empty"))
		}
		if (city === '') {
			errors.push(new Error("City can't be empty"))
		}
		if (address === '') {
			errors.push(new Error("Address can't be empty"))
		}

		if (errors.length > 0) {
			return R.fail(errors)
		}

		const cinema = new Cinema()
		cinema.id = v7()
		cinema.name = name
		cinema.city = city
		cinema.address = address

		return R.succeed(cinema)
	}

	update({ name, city, address }: Partial<CreateCinemaInput>) {
		if (name !== undefined) {
			name = name.trim()
			if (name === '') {
				return R.fail(new Error("Name can't be empty"))
			}
			this.name = name
		}

		if (city !== undefined) {
			city = city.trim()
			if (city === '') {
				return R.fail(new Error("City can't be empty"))
			}
			this.city = city
		}

		if (address !== undefined) {
			address = address.trim()
			if (address === '') {
				return R.fail(new Error("Address can't be empty"))
			}
			this.address = address
		}

		return R.succeed(this)
	}
}

CinemaSchema.setClass(Cinema)
