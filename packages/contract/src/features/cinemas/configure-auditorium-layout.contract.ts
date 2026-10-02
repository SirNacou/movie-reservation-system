import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const SeatTypeSchema = z.enum(['REGULAR', 'VIP', 'COUPLE', 'ACCESSIBLE'])

export const SeatDefinitionSchema = z.object({
	row: z.string().trim().min(1).max(20),
	number: z.number().int().positive(),
	type: SeatTypeSchema.default('REGULAR'),
})

export const ConfigureAuditoriumLayoutInputSchema = z.object({
	auditoriumId: z.uuid(),
	seats: z.array(SeatDefinitionSchema).min(1, 'At least one seat must be defined'),
})

export const ConfigureAuditoriumLayoutOutputSchema = z.object({
	auditoriumId: z.uuid(),
	totalSeats: z.number().int().positive(),
	message: z.string(),
})

export const configureAuditoriumLayoutContract = oc
	.meta(
		openapi({
			method: 'POST',
			path: '/auditoriums/{auditoriumId}/layout',
			summary: 'Bulk configure seats and update total seat count for an auditorium',
		})
	)
	.input(ConfigureAuditoriumLayoutInputSchema)
	.output(ConfigureAuditoriumLayoutOutputSchema)
