import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'
import { SeatTypeSchema } from './configure-auditorium-layout.contract.js'

export const GetAuditoriumLayoutInputSchema = z.object({
	auditoriumId: z.uuid(),
})

export const LayoutSeatSchema = z.object({
	id: z.uuid(),
	row: z.string(),
	number: z.number(),
	type: SeatTypeSchema,
})

export const AuditoriumLayoutOutputSchema = z.object({
	auditoriumId: z.string().uuid(),
	name: z.string(),
	totalSeats: z.number(),
	seats: z.array(LayoutSeatSchema),
})

export const getAuditoriumLayoutContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/auditoriums/{auditoriumId}/layout',
			summary: 'Get full seating grid layout for an auditorium',
		})
	)
	.input(GetAuditoriumLayoutInputSchema)
	.output(AuditoriumLayoutOutputSchema)
