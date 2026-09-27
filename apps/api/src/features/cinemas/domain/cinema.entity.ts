import { baseProperties } from '@/common/domain/base.properties.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { Auditorium } from './auditorium.entity.js'
import { CinemaIdType, newCinemaId } from './cinema.types.js'

export type CreateCinemaInput = {
	name: string
	city: string
	address: string
}

export const CinemaSchema = defineEntity({
	name: 'Cinema',
	tableName: 'cinemas',
	properties: {
		id: p.type(CinemaIdType).primary(),
		name: p.string().length(255),
		city: p.string().length(100),
		address: p.text(),
		auditorium: () => p.oneToMany(Auditorium).mappedBy('cinema').ref(),
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

		const cinemaVenue = new Cinema()
		cinemaVenue.id = newCinemaId()
		cinemaVenue.name = name
		cinemaVenue.city = city
		cinemaVenue.address = address

		return cinemaVenue
	}
}

CinemaSchema.setClass(Cinema)
