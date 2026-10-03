import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const ListAuditoriumsInputSchema = z.object({
	cinemaId: z.uuid('Invalid cinema ID').optional(),
})

export const AuditoriumListItemSchema = z.object({
	id: z.uuid(),
	cinemaId: z.uuid(),
	cinemaName: z.string().optional(),
	name: z.string(),
	totalSeats: z.number().int().nonnegative(),
})

export const ListAuditoriumsOutputSchema = z.array(AuditoriumListItemSchema)

export const listAuditoriumsContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/auditoriums',
			summary: 'List auditoriums with optional cinema filter',
		})
	)
	.input(ListAuditoriumsInputSchema)
	.output(ListAuditoriumsOutputSchema)
