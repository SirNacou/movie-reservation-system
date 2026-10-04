import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const ListShowtimeSeatsInputSchema = z.object({
	showtimeId: z.uuid('Invalid showtime ID'),
})

export const ShowtimeSeatOutputSchema = z.object({
	id: z.uuid(),
	row: z.string(),
	number: z.number().int(),
	status: z.enum(['AVAILABLE', 'RESERVED']),
})

export const ListShowtimeSeatsOutputSchema = z.array(ShowtimeSeatOutputSchema)

export const listShowtimeSeatsContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/showtimes/{showtimeId}/seats',
			summary: 'List seats and their reservation status for a showtime',
		})
	)
	.input(ListShowtimeSeatsInputSchema)
	.output(ListShowtimeSeatsOutputSchema)
