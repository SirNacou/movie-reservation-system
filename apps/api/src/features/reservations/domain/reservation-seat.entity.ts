import { baseProperties } from '@/common/domain/base.properties.js'
import { Seat } from '@/features/cinemas/domain/seat.entity.js'
import { defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'
import { Reservation } from './reservation.entity.js'

export const ReservationSeatSchema = defineEntity({
	name: 'ReservationSeat',
	tableName: 'reservation_seats',
	properties: {
		id: p.uuid().primary(),
		reservation: () => p.manyToOne(Reservation),
		seat: () => p.manyToOne(Seat),
		...baseProperties,
	},
	indexes: [{ properties: ['reservation', 'seat'] }],
})

export class ReservationSeat extends ReservationSeatSchema.class {
	static create(props: { reservation: Reservation; seat: Seat }): R.Result<ReservationSeat, Error> {
		const reservedSeat = new ReservationSeat()
		reservedSeat.id = v7()
		reservedSeat.reservation = props.reservation
		reservedSeat.seat = props.seat

		return R.succeed(reservedSeat)
	}
}

ReservationSeatSchema.setClass(ReservationSeat)
