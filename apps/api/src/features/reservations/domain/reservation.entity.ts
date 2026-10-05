import { baseProperties } from '@/common/domain/base.properties.js'
import { Showtime } from '@/features/showtimes/domain/showtime.entity.js'
import { Collection, defineEntity, p } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { v7 } from 'uuid'
import { ReservationSeat } from './reservation-seat.entity.js'
import { type CreateReservationProps, ReservationStatus } from './reservation.types.js'

export const ReservationSchema = defineEntity({
	name: 'Reservation',
	tableName: 'reservations',
	properties: {
		id: p.uuid().primary(),
		showtime: () => p.manyToOne(Showtime),
		customerEmail: p.string().length(255),
		customerName: p.string().length(255).nullable(),
		status: p.enum(ReservationStatus).default(ReservationStatus.PENDING),
		expiresAt: p.datetime(),
		seats: () => p.oneToMany(ReservationSeat).mappedBy('reservation').orphanRemoval(),
		...baseProperties,
	},
	indexes: [{ properties: ['showtime', 'status'] }, { properties: ['customerEmail'] }],
})

export class Reservation extends ReservationSchema.class {
	declare seats: Collection<ReservationSeat>

	/**
	 * Factory method: Enforces domain invariants and initializes a temporary hold.
	 */
	static create({
		showtime,
		customerEmail,
		customerName,
		seats,
		holdDurationMinutes = 10,
	}: CreateReservationProps): R.Result<Reservation, Error> {
		const trimmedEmail = customerEmail.trim().toLowerCase()

		if (!trimmedEmail.includes('@')) {
			return R.fail(new Error('A valid customer email is required'))
		}

		if (seats.length === 0) {
			return R.fail(new Error('Reservation must contain at least one seat'))
		}

		const now = new Date()

		if (showtime.startTime <= now) {
			return R.fail(new Error('Cannot reserve seats for a screening that has already started'))
		}

		// Verify all requested seats belong to the show's auditorium.
		const auditoriumId = showtime.auditorium.id

		for (const seat of seats) {
			if (seat.auditorium.id !== auditoriumId) {
				return R.fail(
					new Error(`Seat ${seat.row}${seat.number} does not belong to this auditorium`),
				)
			}
		}

		// Guard against duplicate seat selection within the request.
		const uniqueSeatIds = new Set(seats.map((seat) => seat.id))

		if (uniqueSeatIds.size !== seats.length) {
			return R.fail(new Error('Duplicate seats detected in reservation request'))
		}

		const reservation = new Reservation()

		reservation.id = v7()
		reservation.showtime = showtime
		reservation.customerEmail = trimmedEmail
		reservation.customerName = customerName?.trim() || null
		reservation.status = ReservationStatus.PENDING
		reservation.expiresAt = new Date(now.getTime() + holdDurationMinutes * 60 * 1000)

		// Initialize the child seat entities within the aggregate boundary.
		reservation.seats = new Collection<ReservationSeat>(reservation)

		for (const seat of seats) {
			const reservationSeat = new ReservationSeat()

			reservationSeat.id = v7()
			reservationSeat.reservation = reservation
			reservationSeat.seat = seat

			reservation.seats.add(reservationSeat)
		}

		return R.succeed(reservation)
	}

	/**
	 * Transitions state from PENDING to CONFIRMED.
	 */
	confirm(now: Date = new Date()): R.Result<undefined, Error> {
		if (this.status !== ReservationStatus.PENDING) {
			return R.fail(new Error(`Cannot confirm a reservation with status "${this.status}"`))
		}

		if (now > this.expiresAt) {
			this.status = ReservationStatus.CANCELLED

			return R.fail(new Error('Reservation hold has expired and cannot be confirmed'))
		}

		this.status = ReservationStatus.CONFIRMED

		return R.succeed(undefined)
	}

	/**
	 * Cancels a pending or confirmed reservation.
	 */
	cancel(now: Date = new Date()): R.Result<undefined, Error> {
		if (this.status === ReservationStatus.CANCELLED) {
			return R.fail(new Error('Reservation is already cancelled'))
		}

		if (this.status === ReservationStatus.CONFIRMED) {
			return R.fail(new Error('Reservation is already confirmed'))
		}

		if (this.showtime.startTime <= now) {
			return R.fail(new Error('Cannot cancel a reservation for a screening that has already begun'))
		}

		this.status = ReservationStatus.CANCELLED

		return R.succeed(undefined)
	}

	expire(now: Date = new Date()) {
		if (this.status !== ReservationStatus.PENDING) {
			return R.fail(new Error(`Cannot expire a reservation with status "${this.status}"`))
		}

		if (now < this.expiresAt) {
			return R.fail(new Error('Reservation hold has not expired'))
		}

		this.status = ReservationStatus.CANCELLED

		return R.succeed(undefined)
	}

	/**
	 * Helper check to determine if a pending hold has elapsed.
	 */
	isExpired(now: Date = new Date()): boolean {
		return this.status === ReservationStatus.PENDING && now > this.expiresAt
	}
}

ReservationSchema.setClass(Reservation)
