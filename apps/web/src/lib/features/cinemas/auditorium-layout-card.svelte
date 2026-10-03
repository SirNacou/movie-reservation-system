<script lang="ts">
import Button from '@/components/ui/button/button.svelte'
import * as Card from '@/components/ui/card'
import type { ClassValue } from 'svelte/elements'

import type { GridRow, GridSeat, SeatType } from './auditorium'

type Props = {
	rootClass?: ClassValue
	title: string
	description?: string
	rows: GridRow[]
	selectedSeatType?: SeatType
	seatSelected?: (seat: GridSeat) => void
}

let {
	rootClass,
	title,
	description,
	rows,
	selectedSeatType = 'REGULAR',
	seatSelected,
}: Props = $props()

const seatHoverStyles: Record<SeatType, ClassValue> = {
	REGULAR: 'hover:ring-2 hover:ring-green-500',
	VIP: 'hover:ring-2 hover:ring-amber-500',
	COUPLE: 'hover:ring-2 hover:ring-pink-500',
	ACCESSIBLE: 'hover:ring-2 hover:ring-sky-500',
}

const seatStyles: Record<SeatType, ClassValue> = {
	REGULAR: 'bg-green-200 border-green-400 text-green-900 hover:bg-green-300',
	VIP: 'bg-amber-200 border-amber-400 text-amber-900 hover:bg-amber-300',
	COUPLE: 'bg-pink-200 border-pink-400 text-pink-900 hover:bg-pink-300',
	ACCESSIBLE: 'bg-sky-200 border-sky-400 text-sky-900 hover:bg-sky-300',
}
</script>

<Card.Root class={rootClass}>
	<Card.Header>
		<Card.Title>{title}</Card.Title>

		{#if description}
			<Card.Description>
				{description}
			</Card.Description>
		{/if}
	</Card.Header>

	<Card.Content class="flex flex-col items-center gap-5">
		<div
			class="mb-8 p-2 border-2 rounded-2xl font-bold text-indigo-400 text-2xl text-center tracking-wide"
		>
			SCREEN THIS WAY
		</div>

		<div class="flex items-center gap-2">
			<span class="text-muted-foreground text-sm"> Selected seat type: </span>

			<span
				class={`rounded-md border px-2 py-1 text-sm font-semibold ${seatStyles[selectedSeatType]}`}
			>
				{selectedSeatType}
			</span>

			<span class="text-muted-foreground text-sm"> Click a seat to apply </span>
		</div>

		<div class="flex flex-col gap-2">
			{#each rows as row (row.id)}
				<div class="flex items-center gap-2">
					<div class="p-3 w-8 font-bold text-lg text-center">
						{row.label}
					</div>

					{#each row.seats as seat (seat.number)}
						<Button
							class={`size-12 rounded-lg text-xl font-bold ${seatStyles[seat.type]} ${
	seat.enabled ? `hover:${seatHoverStyles[selectedSeatType]}` : ''
}`}
							disabled={!seat.enabled}
							onclick={() => seatSelected?.(seat)}
						>
							{seat.number}
						</Button>
					{/each}
				</div>
			{/each}
		</div>

		<div class="flex flex-wrap justify-center items-center gap-10">
			{#each Object.entries(seatStyles) as [seatType, seatClass] (seatType)}
				<div class="flex items-center gap-2">
					<div class={`size-5 rounded border ${seatClass}`}></div>

					<span class="font-medium text-sm">
						{seatType}
					</span>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
