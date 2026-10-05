import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'
import { ReservationOutputSchema } from './create-reservation.contract.js'

export const CancelReservationInputSchema = z.object({
	reservationId: z.uuid('Invalid reservation ID'),
})

export const cancelReservationContract = oc
	.meta(
		openapi({
			method: 'POST',
			path: '/reservations/{reservationId}/cancel',
			summary: 'Cancel a reservation',
		})
	)
	.input(CancelReservationInputSchema)
	.output(ReservationOutputSchema)
