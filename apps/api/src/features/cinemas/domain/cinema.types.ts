export const SeatType = {
	REGULAR: 'REGULAR',
	VIP: 'VIP',
	COUPLE: 'COUPLE',
	ACCESSIBLE: 'ACCESSIBLE',
} as const

export type SeatType = (typeof SeatType)[keyof typeof SeatType]
