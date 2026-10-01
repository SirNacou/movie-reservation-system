<script lang="ts">
import Button from '@/components/ui/button/button.svelte'
import * as Dialog from '@/components/ui/dialog'
import * as Field from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { type ApiInputs, orpc } from '@/orpc'
import { createForm } from '@tanstack/svelte-form'
import { createMutation } from '@tanstack/svelte-query'
import PlusIcon from '~icons/ph/plus'

let { cinemaId, onSuccess }: { cinemaId: string; onSuccess?: () => void } = $props()

let open = $state(false)

const createAuditorium = createMutation(() =>
	orpc.cinemas.createAuditorium.mutationOptions({
		onSuccess: () => {
			form.reset()
			open = false
			onSuccess?.()
		},
	})
)

const form = createForm(() => ({
	defaultValues: {
		cinemaId,
		name: '',
	} as ApiInputs['cinemas']['createAuditorium'],
	onSubmit: async ({ value }) => {
		await createAuditorium.mutateAsync(value)
	},
}))
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>
			<PlusIcon />
			Auditorium
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Auditorium</Dialog.Title>
			<Dialog.Description> Enter the details for the new auditorium. </Dialog.Description>
		</Dialog.Header>
		<form
			class="flex flex-col gap-3"
			onsubmit={(event) => {
	event.preventDefault()
	form.handleSubmit()
}}
		>
			<form.Field name="name">
				{#snippet children(
	field
)}
					<Field.Field>
						<Field.Label>Auditorium Name</Field.Label>
						<Input
							value={field.state.value}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
					</Field.Field>
				{/snippet}
			</form.Field>
			<form.Subscribe
				selector={(state) => ({
	canSubmit: state.canSubmit,
	isSubmitting: state.isSubmitting,
})}
			>
				{#snippet children(
	state
)}
					<Field.Field orientation="horizontal" class="justify-end gap-2">
						<Button type="submit" disabled={!state.canSubmit}>
							{state.isSubmitting ? 'Adding…' : 'Add Auditorium'}
						</Button>
						<Button type="button" variant="outline" onclick={() => (open = false)}> Cancel </Button>
					</Field.Field>
				{/snippet}
			</form.Subscribe>
		</form>
	</Dialog.Content>
</Dialog.Root>
