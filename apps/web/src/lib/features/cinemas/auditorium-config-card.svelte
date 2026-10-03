<script lang="ts">
import * as Card from '@/components/ui/card'
import * as Field from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createForm } from '@tanstack/svelte-form'
import type { ClassValue } from 'svelte/elements'
import z from 'zod'
import type { SeatType } from './auditorium'

type Props = {
	rootClass?: ClassValue
	rows: number
	seatsPerRow: number
	selectedSeatType?: SeatType
	dimensionsChanged?: (rows: number, seatsPerRow: number) => void
}

let {
	rootClass,
	rows,
	seatsPerRow,
	selectedSeatType = $bindable('REGULAR'),
	dimensionsChanged,
}: Props = $props()

const seatTypes: SeatType[] = ['REGULAR', 'VIP', 'COUPLE', 'ACCESSIBLE']

const seatTypeStyles: Record<SeatType, string> = {
	REGULAR: 'bg-green-100 border-green-300 text-green-900',
	VIP: 'bg-amber-100 border-amber-300 text-amber-900',
	COUPLE: 'bg-pink-100 border-pink-300 text-pink-900',
	ACCESSIBLE: 'bg-sky-100 border-sky-300 text-sky-900',
}

const form = createForm(() => ({
	defaultValues: {
		rows,
		seatsPerRow,
		seatType: selectedSeatType,
	},

	validators: {
		onChange: z.object({
			rows: z.number().int().min(1).max(26),
			seatsPerRow: z.number().int().min(1).max(26),
			seatType: z.enum(['REGULAR', 'VIP', 'COUPLE', 'ACCESSIBLE']),
		}),
	},

	listeners: {
		onChangeDebounceMs: 500,

		onChange: ({ fieldApi }) => {
			if (!fieldApi.state.meta.isValid) {
				return
			}

			switch (fieldApi.name) {
				case 'rows':
				case 'seatsPerRow':
					dimensionsChanged?.(
						fieldApi.form.getFieldValue('rows'),
						fieldApi.form.getFieldValue('seatsPerRow')
					)
					break

				case 'seatType':
					selectedSeatType = fieldApi.state.value
					break
			}
		},
	},
}))
</script>

<Card.Root class={rootClass}>
	<Card.Header>
		<Card.Title>Layout Configuration</Card.Title>
		<Card.Description> Configure the auditorium layout and seat types. </Card.Description>
	</Card.Header>

	<Card.Content class="flex flex-col gap-6">
		<!-- Grid Configuration -->
		<div class="flex flex-col gap-3">
			<div>
				<h3 class="font-semibold text-sm">Grid</h3>
				<p class="text-muted-foreground text-sm">Choose the number of rows and seats.</p>
			</div>

			<div class="gap-3 grid grid-cols-2">
				<form.Field name="rows">
					{#snippet children(
	field
)}
						<Field.Field>
							<Field.Label for="rows">Rows</Field.Label>

							<Input
								id="rows"
								type="number"
								min="1"
								max="26"
								value={field.state.value}
								oninput={(event) => field.handleChange(event.currentTarget.valueAsNumber)}
								onblur={field.handleBlur}
							/>

							{#if field.state.meta.errors.length > 0}
								<Field.Error errors={field.state.meta.errors} />
							{/if}
						</Field.Field>
					{/snippet}
				</form.Field>

				<form.Field name="seatsPerRow">
					{#snippet children(
	field
)}
						<Field.Field>
							<Field.Label for="seatsPerRow"> Seats per row </Field.Label>

							<Input
								id="seatsPerRow"
								type="number"
								min="1"
								max="26"
								value={field.state.value}
								oninput={(event) => field.handleChange(event.currentTarget.valueAsNumber)}
								onblur={field.handleBlur}
							/>

							{#if field.state.meta.errors.length > 0}
								<Field.Error errors={field.state.meta.errors} />
							{/if}
						</Field.Field>
					{/snippet}
				</form.Field>
			</div>
		</div>

		<!-- Seat Type -->
		<div class="flex flex-col gap-3">
			<div>
				<h3 class="font-semibold text-sm">Seat Type</h3>
				<p class="text-muted-foreground text-sm">
					Select a type, then click seats in the layout to apply it.
				</p>
			</div>

			<form.Field name="seatType">
				{#snippet children(
	field
)}
					<div class="gap-2 grid grid-cols-2">
						{#each seatTypes as type}
							<button
								type="button"
								class={`flex h-20 flex-col items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all ${seatTypeStyles[type]} ${
	field.state.value === type
		? 'ring-2 ring-foreground ring-offset-2'
		: 'opacity-70 hover:opacity-100'
}`}
								onclick={() => field.handleChange(type)}
							>
								<span>{type}</span>

								{#if field.state.value === type}
									<span class="opacity-70 mt-1 font-normal text-xs"> Selected </span>
								{/if}
							</button>
						{/each}
					</div>
				{/snippet}
			</form.Field>
		</div>
	</Card.Content>
</Card.Root>
