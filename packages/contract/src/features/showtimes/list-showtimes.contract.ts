import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const ListShowtimesInputSchema = z.object({
	cinemaId: z.uuid('Invalid cinema ID').optional(),
	movieId: z.uuid('Invalid movie ID').optional(),
	date: z.date().optional(),
})

export const ShowtimeTableItemSchema = z.object({
	id: z.uuid(),
	// Movie column
	movieId: z.uuid(),
	movieTitle: z.string(),
	// Cinema & Auditorium columns
	cinemaId: z.uuid(),
	cinemaName: z.string(),
	auditoriumId: z.uuid(),
	auditoriumName: z.string(),
	// Date & Time, Duration, and End Time columns
	startTime: z.date(),
	endTime: z.date(),
	durationMinutes: z.number().int().positive(),
})

export const ListShowtimesOutputSchema = z.array(ShowtimeTableItemSchema)

export const listShowtimesContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/showtimes',
			summary: 'List showtimes with movie, cinema, hall, and duration info',
		})
	)
	.input(ListShowtimesInputSchema)
	.output(ListShowtimesOutputSchema)
