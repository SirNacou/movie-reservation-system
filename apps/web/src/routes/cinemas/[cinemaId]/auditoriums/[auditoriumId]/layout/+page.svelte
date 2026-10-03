<script lang="ts">
import { page } from '$app/state'
import {
	type GridRow,
	type GridSeat,
	type SeatType,
	toGridRows,
} from '@/features/cinemas/auditorium'
import AuditoriumConfigCard from '@/features/cinemas/auditorium-config-card.svelte'
import AuditoriumLayoutCard from '@/features/cinemas/auditorium-layout-card.svelte'
import { orpc } from '@/orpc'
import { createQuery } from '@tanstack/svelte-query'

const DEFAULT_ROWS = 8
const DEFAULT_SEATS_PER_ROW = 12

const getAuditorium = createQuery(() =>
	orpc.cinemas.getLayout.queryOptions({
		input: {
			auditoriumId: page.params.auditoriumId!,
		},
	})
)

let gridRows = $state<GridRow[]>([])
let selectedSeatType = $state<SeatType>('REGULAR')
let initialized = false

function createGrid(rows: number, seatsPerRow: number): GridRow[] {
	return Array.from({ length: rows }, (_, rowIndex) => ({
		id: crypto.randomUUID(),
		label: String.fromCharCode(65 + rowIndex),
		seats: Array.from({ length: seatsPerRow }, (_, seatIndex) => ({
			id: crypto.randomUUID(),
			number: seatIndex + 1,
			type: 'REGULAR',
			enabled: true,
		})),
	}))
}

$effect(() => {
	if (initialized || !getAuditorium.isSuccess) {
		return
	}

	const auditorium = getAuditorium.data

	if (auditorium?.seats?.length) {
		gridRows = toGridRows(auditorium)
	} else {
		gridRows = createGrid(DEFAULT_ROWS, DEFAULT_SEATS_PER_ROW)
	}

	initialized = true
})

const rows = $derived(gridRows.length || DEFAULT_ROWS)

const seatsPerRow = $derived(gridRows[0]?.seats.length || DEFAULT_SEATS_PER_ROW)

function handleDimensionsChanged(rows: number, seatsPerRow: number) {
	gridRows = createGrid(rows, seatsPerRow)
}

function handleSeatSelected(seat: GridSeat) {
	gridRows = gridRows.map((row) => ({
		...row,
		seats: row.seats.map((currentSeat) =>
			currentSeat.id === seat.id
				? {
						...currentSeat,
						type: selectedSeatType,
					}
				: currentSeat
		),
	}))
}
</script>

<div class="flex gap-3">
	<AuditoriumConfigCard
		rootClass="flex-1"
		{rows}
		{seatsPerRow}
		dimensionsChanged={handleDimensionsChanged}
		bind:selectedSeatType
	/>

	<AuditoriumLayoutCard
		rootClass="flex-3"
		title="Auditorium Layout"
		description="Preview and configure the layout of the auditorium."
		rows={gridRows}
		seatSelected={handleSeatSelected}
		{selectedSeatType}
	/>
</div>
