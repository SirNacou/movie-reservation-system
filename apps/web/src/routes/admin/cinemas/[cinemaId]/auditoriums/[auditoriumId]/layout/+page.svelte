<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { Button } from '@/components/ui/button';
import {
    type GridRow,
    type GridSeat,
    type SeatType,
    toGridRows,
} from '@/features/cinemas/auditorium';
import AuditoriumConfigCard from '@/features/cinemas/auditorium-config-card.svelte';
import AuditoriumLayoutCard from '@/features/cinemas/auditorium-layout-card.svelte';
import { type ApiInputs, orpc } from '@/orpc';
import { getApiErrorMessage } from '@/utils/api-error';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';

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

const configureLayout = createMutation(() =>
	orpc.cinemas.configureLayout.mutationOptions({
		onSuccess: () => {
			toast.success('Configure succeed')
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error))
		},
	})
)

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

function handleCancel() {
	goto(resolve('/admin/cinemas/[cinemaId]', { cinemaId: page.params.cinemaId! }))
}

async function handleSubmit() {
	const auditoriumId = page.params.auditoriumId!

	await configureLayout.mutateAsync({
		auditoriumId,
		seats: gridRows.flatMap((row) =>
			row.seats.map(
				(seat) =>
					({
						row: row.label,
						number: seat.number,
						type: seat.type,
					}) as ApiInputs['cinemas']['configureLayout']['seats'][number]
			)
		),
	})
}
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-3">
		<AuditoriumConfigCard
			rootClass="flex-1"
			{rows}
			{seatsPerRow}
			bind:selectedSeatType
			dimensionsChanged={handleDimensionsChanged}
		/>

		<AuditoriumLayoutCard
			rootClass="flex-3"
			title="Auditorium Layout"
			description="Preview and configure the layout of the auditorium."
			rows={gridRows}
			{selectedSeatType}
			seatSelected={handleSeatSelected}
		/>
	</div>

	<div class="pt-4 border-t">
		<div class="flex justify-end items-center gap-3">
			<Button variant="ghost" onclick={handleCancel}> Cancel </Button>

			<Button size="lg" onclick={handleSubmit}> Save Layout </Button>
		</div>
	</div>
</div>
