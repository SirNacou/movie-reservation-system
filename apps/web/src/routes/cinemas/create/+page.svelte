<script lang="ts">
import PageHeader from '@/components/page-header.svelte'
import Button from '@/components/ui/button/button.svelte'
import * as Field from '@/components/ui/field'
import Input from '@/components/ui/input/input.svelte'
import { safeGoto } from '@/navigation'
import { type ApiInputs, orpc } from '@/orpc'
import { createCinemaRequest } from '@repo/contract'
import { createForm, formOptions } from '@tanstack/svelte-form'
import { createMutation } from '@tanstack/svelte-query'

const createCinema = createMutation(() =>
	orpc.cinemas.create.mutationOptions({
		onSuccess: async () => {
			await safeGoto('/cinemas')
		},
	})
)

const formOpts = formOptions({
	defaultValues: {
		name: '',
		city: '',
		address: '',
	} as ApiInputs['cinemas']['create'],
	validators: {
		onChange: createCinemaRequest,
	},
})

const form = createForm(() => ({
	...formOpts,
	onSubmit: async ({ value }) => {
		await createCinema.mutateAsync(value)
	},
}))
</script>

<PageHeader title="Add Cinema" />

<form
	onsubmit={(e) => {
	e.preventDefault()
	e.stopPropagation()
	form.handleSubmit()
}}
>
	<Field.Set>
		<Field.Group>
			<form.Field name="name">
				{#snippet children(
	field
)}
					<Field.Field>
						<Field.Label for="name">Name</Field.Label>
						<Input
							id="name"
							autocomplete="off"
							placeholder="Cinema name"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
							aria-invalid={field.state.meta.errors.length > 0}
						/>
						{#if field.state.meta.errors.length > 0}
							<Field.Error
								errors={field.state.meta.errors.map((e) => ({ message: e?.message ?? '' }))}
							/>
						{/if}
					</Field.Field>
				{/snippet}
			</form.Field>
			<form.Field name="city">
				{#snippet children(
	field
)}
					<Field.Field>
						<Field.Label for="city">City</Field.Label>
						<Input
							id="city"
							autocomplete="off"
							placeholder="City"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
							aria-invalid={field.state.meta.errors.length > 0}
						/>
						{#if field.state.meta.errors.length > 0}
							<Field.Error
								errors={field.state.meta.errors.map((e) => ({ message: e?.message ?? '' }))}
							/>
						{/if}
					</Field.Field>
				{/snippet}
			</form.Field>
			<form.Field name="address">
				{#snippet children(
	field
)}
					<Field.Field>
						<Field.Label for="address">Address</Field.Label>
						<Input
							id="address"
							autocomplete="off"
							placeholder="Address"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
							aria-invalid={field.state.meta.errors.length > 0}
						/>
						{#if field.state.meta.errors.length > 0}
							<Field.Error
								errors={field.state.meta.errors.map((e) => ({ message: e?.message ?? '' }))}
							/>
						{/if}
					</Field.Field>
				{/snippet}
			</form.Field>
			<div class="flex items-center gap-2 w-fit">
				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
					{#snippet children([canSubmit, isSubmitting])}
						<Button type="submit" disabled={!canSubmit || isSubmitting}>
							{isSubmitting ? 'Creating…' : 'Create'}
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							onclick={() => safeGoto('/cinemas')}
						>
							Cancel
						</Button>
					{/snippet}
				</form.Subscribe>
			</div>
		</Field.Group>
	</Field.Set>
</form>
