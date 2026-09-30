import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const UpdateCinemaInputSchema = z.object({
	id: z.uuid(),
	name: z.string().trim().min(1, 'Name cannot be empty').max(255).optional(),
	city: z.string().trim().min(1, 'City cannot be empty').max(100).optional(),
	address: z.string().trim().min(1, 'Address cannot be empty').optional(),
})

export const UpdateCinemaOutputSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	city: z.string(),
	address: z.string(),
})

export const updateCinemaContract = oc
	.meta(
		openapi({
			method: 'PATCH',
			path: '/cinemas/{id}',
			summary: 'Update cinema details',
		})
	)
	.input(UpdateCinemaInputSchema)
	.output(UpdateCinemaOutputSchema)
	.errors({
		NOT_FOUND: {
			message: 'Cinema not found',
		},
	})
