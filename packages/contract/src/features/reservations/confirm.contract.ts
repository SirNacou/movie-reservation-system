import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'
import { ReservationOutputSchema } from './create-reservation.contract.js'

export const ConfirmReservationInputSchema = z.object({
	reservationId: z.uuid('Invalid reservation ID'),
})

export const confirmReservationContract = oc
	.meta(
		openapi({
			method: 'POST',
			path: '/reservations/{reservationId}/confirm',
			summary: 'Confirm a reservation',
		})
	)
	.input(ConfirmReservationInputSchema)
	.output(ReservationOutputSchema)
