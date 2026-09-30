import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const GetCinemaInputSchema = z.object({
	id: z.uuid('Invalid cinema ID'),
})

export const CinemaAuditoriumSummarySchema = z.object({
	id: z.uuid(),
	name: z.string(),
	totalSeats: z.number().int().nonnegative(),
})

export const CinemaDetailsOutputSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	city: z.string(),
	address: z.string(),
	auditoriums: z.array(CinemaAuditoriumSummarySchema),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const getCinemaContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/cinemas/{id}',
			summary: 'Get cinema details and its auditoriums',
		})
	)
	.input(GetCinemaInputSchema)
	.output(CinemaDetailsOutputSchema)
	.errors({
		NOT_FOUND: {
			message: 'Cinema not found',
		},
	})
