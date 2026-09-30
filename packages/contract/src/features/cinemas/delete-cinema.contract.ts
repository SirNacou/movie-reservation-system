import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const deleteCinemaContract = oc
	.meta(
		openapi({
			path: '/api/cinemas/{id}',
			method: 'DELETE',
			successStatus: 200,
		})
	)
	.input(
		z.object({
			id: z.uuidv7(),
		})
	)
