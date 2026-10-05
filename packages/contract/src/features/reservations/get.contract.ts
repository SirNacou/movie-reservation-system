import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'
import { ReservationOutputSchema } from './create-reservation.contract.js'

export const GetReservationInputSchema = z.object({
	reservationId: z.uuid('Invalid reservation ID'),
})

export const getReservationContract = oc
	.meta(
		openapi({
			method: 'GET',
			path: '/reservations/{reservationId}',
			summary: 'Get a reservation',
		})
	)
	.input(GetReservationInputSchema)
	.output(ReservationOutputSchema)
