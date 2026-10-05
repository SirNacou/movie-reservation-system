import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'
import {
	ReservationSeatOutputSchema,
	ReservationStatusSchema,
} from './create-reservation.contract.js'

export const ListAdminReservationsInputSchema = z.object({
	customerEmail: z.email('Invalid customer email').optional(),
	status: ReservationStatusSchema.optional(),
	showtimeId: z.uuid('Invalid showtime ID').optional(),
})

export const ListAdminReservationOutputSchema = z.object({
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

export const ListAdminReservationsOutputSchema = z.array(ListAdminReservationOutputSchema)

export const listAdminReservationsContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/admin/reservations',
			summary: 'List reservations for administration',
		})
	)
	.input(ListAdminReservationsInputSchema)
	.output(ListAdminReservationsOutputSchema)
