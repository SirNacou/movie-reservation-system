import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const CancelShowtimeInputSchema = z.object({
	id: z.uuid('Invalid showtime ID'),
})

export const CancelShowtimeOutputSchema = z.object({
	id: z.uuid(),
	message: z.string(),
})

export const cancelShowtimeContract = oc
	.meta(
		openapi({
			method: 'DELETE',
			path: '/showtimes/{id}',
			summary: 'Cancel/delete a scheduled showtime',
		})
	)
	.input(CancelShowtimeInputSchema)
	.output(CancelShowtimeOutputSchema)
