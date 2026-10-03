import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const ListShowtimesByAuditoriumInputSchema = z.object({
	auditoriumId: z.uuid('Invalid auditorium ID'),
	date: z.date().optional(),
})

export const AuditoriumShowtimeItemSchema = z.object({
	id: z.uuid(),
	movieId: z.uuid(),
	movieTitle: z.string(),
	moviePosterUrl: z.string().nullable(),
	startTime: z.date(),
	endTime: z.date(),
})

export const ListShowtimesByAuditoriumOutputSchema = z.array(AuditoriumShowtimeItemSchema)

export const listShowtimesByAuditoriumContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/auditoriums/{auditoriumId}/showtimes',
			summary: 'List scheduled showtimes for an auditorium',
		})
	)
	.input(ListShowtimesByAuditoriumInputSchema)
	.output(ListShowtimesByAuditoriumOutputSchema)
