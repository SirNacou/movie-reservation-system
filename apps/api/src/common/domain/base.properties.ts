import { p } from '@mikro-orm/core'

export const baseProperties = {
	createdAt: p.datetime().onCreate(() => new Date()),
	updatedAt: p
		.datetime()
		.onCreate(() => new Date())
		.onUpdate(() => new Date()),
}

export type BaseProperties = {
	createdAt: Date
	updatedAt: Date
}
