import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const CreateAuditoriumInputSchema = z.object({
	cinemaId: z.uuid('Invalid cinema ID'),
	name: z.string().trim().min(1, 'Hall name is required').max(100),
})

export const AuditoriumOutputSchema = z.object({
	id: z.uuid(),
	cinemaId: z.uuid(),
	name: z.string(),
	totalSeats: z.number().int().nonnegative(),
})

export const createAuditoriumContract = oc
	.meta(
		openapi({
			method: 'POST',
			path: '/cinemas/{cinemaId}/auditoriums',
			summary: 'Create a new auditorium for a cinema',
		})
	)
	.input(CreateAuditoriumInputSchema)
	.output(AuditoriumOutputSchema)
