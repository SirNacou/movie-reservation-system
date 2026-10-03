import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const ListShowtimesByMovieInputSchema = z.object({
	movieId: z.uuid('Invalid movie ID'),
	date: z.date().optional(), // Filter by specific calendar day (UTC/Local date)
})

export const ShowtimeSummaryItemSchema = z.object({
	id: z.uuid(),
	auditoriumId: z.uuid(),
	auditoriumName: z.string(),
	cinemaId: z.uuid(),
	cinemaName: z.string(),
	cinemaCity: z.string(),
	startTime: z.date(),
	endTime: z.date(),
})

export const ListShowtimesByMovieOutputSchema = z.array(ShowtimeSummaryItemSchema)

export const listShowtimesByMovieContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/movies/{movieId}/showtimes',
			summary: 'List available showtimes for a specific movie',
		})
	)
	.input(ListShowtimesByMovieInputSchema)
	.output(ListShowtimesByMovieOutputSchema)
