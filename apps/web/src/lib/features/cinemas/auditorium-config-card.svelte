<script lang="ts">
import * as Card from '@/components/ui/card'
import * as Field from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createForm } from '@tanstack/svelte-form'
import type { ClassValue } from 'svelte/elements'
import z from 'zod'

type Props = {
	rootClass?: ClassValue
	rowChanged?: (rows: number) => void
	seatsPerRowChanged?: (seatsPerRow: number) => void
}

const { rootClass, rowChanged, seatsPerRowChanged }: Props = $props()

const form = createForm(() => ({
	defaultValues: {
		rows: 8,
		seatsPerRow: 12,
	} as {
		rows: number
		seatsPerRow: number
	},
	validators: {
		onChange: z.object({
			rows: z.number().min(1).max(26),
			seatsPerRow: z.number().min(1).max(26),
		}),
	},
	listeners: {
		onChangeDebounceMs: 500,
		onChange: ({ fieldApi }) => {
			if (fieldApi.state.meta.isValid) {
				if (fieldApi.name === 'rows') {
					rowChanged?.(fieldApi.state.value)
				} else if (fieldApi.name === 'seatsPerRow') {
					seatsPerRowChanged?.(fieldApi.state.value)
				}
			}
		},
	},
}))
</script>

<Card.Root class={rootClass}>
	<Card.Header>
		<Card.Title>Layout</Card.Title>
		<Card.Description>
			Starts with 8 rows of 12 seats. Adjust dimensions and regenerate.
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<form class="flex flex-col gap-3" onsubmit={(event) => event.preventDefault()}>
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
							oninput={(e) => field.handleChange(e.currentTarget.valueAsNumber)}
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
						<Field.Label for="seatsPerRow">Seats per row</Field.Label>
						<Input
							id="seatsPerRow"
							type="number"
							min="1"
							max="26"
							value={field.state.value}
							oninput={(e) => field.handleChange(e.currentTarget.valueAsNumber)}
							onblur={field.handleBlur}
						/>
						{#if field.state.meta.errors.length > 0}
							<Field.Error errors={field.state.meta.errors} />
						{/if}
					</Field.Field>
				{/snippet}
			</form.Field>
		</form>
	</Card.Content>
</Card.Root>
