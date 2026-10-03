import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const GetShowtimeInputSchema = z.object({
	id: z.uuid('Invalid showtime ID'),
})

export const ShowtimeDetailsOutputSchema = z.object({
	id: z.uuid(),
	movieId: z.uuid(),
	movieTitle: z.string(),
	moviePosterUrl: z.string().nullable(),
	durationMinutes: z.number().int(),
	auditoriumId: z.uuid(),
	auditoriumName: z.string(),
	cinemaId: z.uuid(),
	cinemaName: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	totalSeats: z.number().int().nonnegative(),
})

export const getShowtimeContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/showtimes/{id}',
			summary: 'Get full showtime details for seat reservation',
		})
	)
	.input(GetShowtimeInputSchema)
	.output(ShowtimeDetailsOutputSchema)
