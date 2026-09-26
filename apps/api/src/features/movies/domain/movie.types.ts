import { EntityProperty, Platform, Type } from '@mikro-orm/core'
import { v7 } from 'uuid'

export type MovieId = string & { readonly __brand: unique symbol }
export const newMovieId = () => v7() as MovieId

export class MovieIdType extends Type<MovieId, string> {
	convertToDatabaseValue(value: MovieId): string {
		return value
	}
	convertToJSValue(value: string): MovieId {
		return value as MovieId
	}
	getColumnType(_: EntityProperty, platform: Platform) {
		return platform.getUuidTypeDeclarationSQL({})
	}
}
