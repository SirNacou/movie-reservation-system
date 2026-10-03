import type { ApiOutputs } from '@/orpc'
import type { SeatTypeSchema } from '@repo/contract'
import type { z } from 'zod'

export type SeatType = z.infer<typeof SeatTypeSchema>

export type GridSeat = {
	id: string
	number: number
	type: SeatType
	enabled: boolean
}

export type GridRow = {
	id: string
	label: string
	seats: GridSeat[]
}

export function toGridRows(data: ApiOutputs['cinemas']['getLayout'] | undefined | null): GridRow[] {
	if (!data?.seats || data.seats.length === 0) {
		return []
	}

	const rowMap = new Map<string, Map<number, { type: SeatType }>>()
	let maxCol = 0

	for (const seat of data.seats) {
		const row = seat.row.trim().toUpperCase()

		if (!rowMap.has(row)) {
			rowMap.set(row, new Map())
		}

		rowMap.get(row)!.set(seat.number, { type: seat.type })

		if (seat.number > maxCol) {
			maxCol = seat.number
		}
	}

	const sortedRowLabels = Array.from(rowMap.keys()).sort((a, b) =>
		a.localeCompare(b, undefined, {
			numeric: true,
			sensitivity: 'base',
		})
	)

	return sortedRowLabels.map((label) => {
		const rowSeats = rowMap.get(label)!
		const seats: GridSeat[] = []

		for (let col = 1; col <= maxCol; col++) {
			const existingSeat = rowSeats.get(col)

			if (existingSeat) {
				seats.push({
					id: crypto.randomUUID(),
					number: col,
					type: existingSeat.type,
					enabled: true,
				})
			} else {
				seats.push({
					id: crypto.randomUUID(),
					number: col,
					type: 'REGULAR',
					enabled: false,
				})
			}
		}

		return {
			id: crypto.randomUUID(),
			label,
			seats,
		}
	})
}
