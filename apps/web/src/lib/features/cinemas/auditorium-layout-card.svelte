<script lang="ts">
import Button from '@/components/ui/button/button.svelte'
import * as Card from '@/components/ui/card'
import type { SeatTypeSchema } from '@repo/contract'
import type { ClassValue } from 'svelte/elements'
import type z from 'zod'

export type SeatType = z.infer<typeof SeatTypeSchema>

export type SeatDefinition = {
	row: string
	number: number
	type: SeatType
}

type Props = {
	rootClass?: ClassValue
	title: string
	description?: string
	seats: SeatDefinition[]
	seatSelected?: (seat: SeatDefinition) => void
}
const { title, description, seats, seatSelected, rootClass }: Props = $props()

const seatStyles: Record<SeatType, ClassValue> = {
	REGULAR: 'bg-green-200 border-green-400 text-green-900 hover:bg-green-300',
	VIP: 'bg-amber-200 border-amber-400 text-amber-900 hover:bg-amber-300',
	COUPLE: 'bg-pink-200 border-pink-400 text-pink-900 hover:bg-pink-300',
	ACCESSIBLE: 'bg-sky-200 border-sky-400 text-sky-900 hover:bg-sky-300',
}

const seatsByRow = $derived(() =>
	Object.entries(Object.groupBy(seats, (seat) => seat.row))
		.sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
		.filter((entry): entry is [string, SeatDefinition[]] => !!entry[1])
)
</script>

<Card.Root class={rootClass}>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		{#if description}
			<Card.Description>{description}</Card.Description>
		{/if}
	</Card.Header>

	<Card.Content class="flex flex-col items-center gap-5">
		<div
			class="mb-8 p-2 border-2 rounded-2xl font-bold text-indigo-400 text-2xl text-center tracking-wide"
		>
			SCREEN THIS WAY
		</div>

		<div class="flex flex-col gap-2">
			{#each seatsByRow() as [row, seatsInRow] (row)}
				<div class="flex items-center gap-2">
					<div class="p-3 font-bold text-lg">{row}</div>
					{#each seatsInRow as seat (seat.number)}
						<Button
							class={`rounded-lg size-12 text-xl font-bold ${seatStyles[seat.type]}`}
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
					<div class={`size-5 ${seatClass}`}></div>
					<span class="font-medium text-sm">{seatType}</span>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
