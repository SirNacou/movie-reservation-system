import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'
import {
	ReservationSeatOutputSchema,
	ReservationStatusSchema,
} from './create-reservation.contract.js'

export const ListReservationsInputSchema = z.object({
	customerEmail: z.email('Invalid customer email'),
})

export const ListReservationOutputSchema = z.object({
	id: z.uuid(),
	showtimeId: z.uuid(),
	movieTitle: z.string(),
	cinemaName: z.string(),
	auditoriumName: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	customerEmail: z.email(),
	customerName: z.string().nullable(),
	status: ReservationStatusSchema,
	expiresAt: z.date(),
	seats: z.array(ReservationSeatOutputSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const ListReservationsOutputSchema = z.array(ListReservationOutputSchema)

export const listReservationsContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/reservations',
			summary: 'List reservations by customer email',
		})
	)
	.input(ListReservationsInputSchema)
	.output(ListReservationsOutputSchema)
