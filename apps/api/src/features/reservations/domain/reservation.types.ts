import { Seat } from '@/features/cinemas/domain/seat.entity.js'
import { Showtime } from '@/features/showtimes/domain/showtime.entity.js'

export const ReservationStatus = {
	PENDING: 'PENDING',
	CONFIRMED: 'CONFIRMED',
	CANCELLED: 'CANCELLED',
} as const

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]

export interface CreateReservationProps {
	showtime: Showtime
	customerEmail: string
	customerName?: string | null
	seats: Seat[]
	holdDurationMinutes?: number // Defaults to 10 minutes
}
