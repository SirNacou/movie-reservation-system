import { EntityProperty, Platform, Type } from '@mikro-orm/core'
import { v7 } from 'uuid'

export type CinemaId = string & { readonly __brand: unique symbol }
export type AuditoriumId = string & { readonly __brand: unique symbol }
export type SeatId = string & { readonly __brand: unique symbol }
export const newCinemaId = () => v7() as CinemaId
export const newAuditoriumId = () => v7() as AuditoriumId
export const newSeatId = () => v7() as SeatId

export const SeatType = {
	REGULAR: 'REGULAR',
	VIP: 'VIP',
	COUPLE: 'COUPLE',
	ACCESSIBLE: 'ACCESSIBLE',
} as const

export type SeatType = (typeof SeatType)[keyof typeof SeatType]

export class CinemaIdType extends Type<CinemaId, string> {
	convertToDatabaseValue(value: CinemaId): string {
		return value
	}
	convertToJSValue(value: string): CinemaId {
		return value as CinemaId
	}
	getColumnType(_: EntityProperty, platform: Platform) {
		return platform.getUuidTypeDeclarationSQL({})
	}
}

export class AuditoriumIdType extends Type<AuditoriumId, string> {
	override convertToDatabaseValue(value: AuditoriumId): string {
		return value
	}
	override convertToJSValue(value: string): AuditoriumId {
		return value as AuditoriumId
	}
	getColumnType(_: EntityProperty, platform: Platform) {
		return platform.getUuidTypeDeclarationSQL({})
	}
}

export class SeatIdType extends Type<SeatId, string> {
	override convertToDatabaseValue(value: SeatId): string {
		return value
	}
	override convertToJSValue(value: string): SeatId {
		return value as SeatId
	}
	getColumnType(_: EntityProperty, platform: Platform) {
		return platform.getUuidTypeDeclarationSQL({})
	}
}
