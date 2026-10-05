import { EntityManager } from '@mikro-orm/core'
import { R } from '@praha/byethrow'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Reservation } from '../domain/reservation.entity.js'
import { GetReservationHandler } from './get-reservation.handler.js'

afterEach(() => {
	vi.restoreAllMocks()
})

describe('GetReservationHandler', () => {
	it('returns a reservation with its seats and showtime ID', async () => {
		const createdAt = new Date('2026-01-01T10:00:00.000Z')
		const updatedAt = new Date('2026-01-01T10:01:00.000Z')
		const expiresAt = new Date('2026-01-01T10:10:00.000Z')
		const reservation = {
			id: 'reservation-id',
			showtime: { id: 'showtime-id' },
			customerEmail: 'guest@example.com',
			customerName: 'Guest',
			status: 'PENDING',
			expiresAt,
			seats: {
				getItems: () => [
					{
						id: 'reservation-seat-id',
						seat: { id: 'seat-id', row: 'A', number: 4 },
					},
				],
			},
			createdAt,
			updatedAt,
		} as unknown as Reservation
		const findOne = vi.fn().mockResolvedValue(reservation)
		const handler = new GetReservationHandler({ findOne } as unknown as EntityManager)

		const result = await handler.handle({ reservationId: 'reservation-id' })

		expect(R.isSuccess(result)).toBe(true)
		if (R.isFailure(result)) throw result.error
		expect(result.value).toEqual({
			id: 'reservation-id',
			showtimeId: 'showtime-id',
			customerEmail: 'guest@example.com',
			customerName: 'Guest',
			status: 'PENDING',
			expiresAt,
			seats: [{ id: 'reservation-seat-id', seatId: 'seat-id', row: 'A', number: 4 }],
			createdAt,
			updatedAt,
		})
		expect(findOne).toHaveBeenCalledWith(
			Reservation,
			{ id: 'reservation-id' },
			{ populate: ['showtime', 'seats', 'seats.seat'] },
		)
	})

	it('returns a failure when the reservation does not exist', async () => {
		const findOne = vi.fn().mockResolvedValue(null)
		const handler = new GetReservationHandler({ findOne } as unknown as EntityManager)

		const result = await handler.handle({ reservationId: 'missing-id' })

		expect(R.isFailure(result)).toBe(true)
		if (R.isFailure(result)) {
			expect(result.error.message).toBe('Reservation with ID missing-id not found')
		}
	})
})
