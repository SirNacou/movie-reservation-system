import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const ScheduleShowtimeInputSchema = z.object({
	movieId: z.uuid('Invalid movie ID'),
	auditoriumId: z.uuid('Invalid auditorium ID'),
	startTime: z.date(),
	turnoverBufferMinutes: z.number().int().min(0).default(15),
})

export const ShowtimeOutputSchema = z.object({
	id: z.uuid(),
	movieId: z.uuid(),
	auditoriumId: z.uuid(),
	startTime: z.date(),
	endTime: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const scheduleShowtimeContract = oc
	.meta(
		openapi({
			method: 'POST',
			path: '/showtimes',
			summary: 'Schedule a screening slot in an auditorium',
		})
	)
	.input(ScheduleShowtimeInputSchema)
	.output(ShowtimeOutputSchema)
