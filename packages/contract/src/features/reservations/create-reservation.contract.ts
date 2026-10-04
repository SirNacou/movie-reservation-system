import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const ReservationStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED'])

export const CreateReservationInputSchema = z.object({
	showtimeId: z.uuid('Invalid showtime ID'),
	customerEmail: z.email('Invalid customer email'),
	customerName: z.string().trim().max(255).optional(),
	seatIds: z.array(z.uuid('Invalid seat ID')).min(1, 'At least one seat is required'),
})

export const ReservationSeatOutputSchema = z.object({
	id: z.uuid(),
	seatId: z.uuid(),
	row: z.string(),
	number: z.number().int(),
})

export const ReservationOutputSchema = z.object({
	id: z.uuid(),
	showtimeId: z.uuid(),
	customerEmail: z.email(),
	customerName: z.string().nullable(),
	status: ReservationStatusSchema,
	expiresAt: z.date(),
	seats: z.array(ReservationSeatOutputSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createReservationContract = oc
	.meta(
		openapi({
			method: 'POST',
			path: '/reservations',
			summary: 'Create a movie reservation',
		})
	)
	.input(CreateReservationInputSchema)
	.output(ReservationOutputSchema)
