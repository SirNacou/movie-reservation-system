<script lang="ts">
import { goto } from '$app/navigation';
import Button from '@/components/ui/button/button.svelte';
import * as Card from '@/components/ui/card';
import DateTimePicker from '@/components/ui/date-time-picker/date-time-picker.svelte';
import * as Field from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import Separator from '@/components/ui/separator/separator.svelte';
import { orpc } from '@/orpc';
import { getApiErrorMessage } from '@/utils/api-error';
import { createForm } from '@tanstack/svelte-form';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';
import z from 'zod';

const form = createForm(() => ({
	defaultValues: {
		movieId: '',
		cinemaId: '',
		auditoriumId: '',
		startTime: new Date(),
		turnoverBufferMinutes: 15,
	},

	validators: {
		onSubmit: z.object({
			movieId: z.uuid('Please select a movie'),
			cinemaId: z.uuid('Please select a cinema'),
			auditoriumId: z.uuid('Please select an auditorium'),
			startTime: z.date(),
			turnoverBufferMinutes: z.number().int().min(0, 'Buffer cannot be negative'),
		}),
	},

	onSubmit: ({ value }) => {
		scheduleShowtime.mutate({
			auditoriumId: value.auditoriumId,
			movieId: value.movieId,
			startTime: value.startTime,
			turnoverBufferMinutes: value.turnoverBufferMinutes,
		})
	},
}))
let selectedCinemaId = $state('')

const movies = createQuery(() => orpc.movies.list.queryOptions())

const cinemas = createQuery(() => orpc.cinemas.list.queryOptions())

const auditoriums = createQuery(() => ({
	...orpc.cinemas.listAuditoriums.queryOptions({
		input: {
			cinemaId: selectedCinemaId,
		},
	}),
	enabled: !!selectedCinemaId,
}))

const scheduleShowtime = createMutation(() =>
	orpc.showtimes.schedule.mutationOptions({
		onSuccess: () => {
			toast.success('Showtime scheduled')
			goto('/admin/showtimes')
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error))
		},
	})
)

function handleCancel() {
	goto('/admin/showtimes')
}
</script>

<div class="flex flex-col gap-6 mx-auto w-full max-w-3xl">
	<div>
		<h1 class="font-semibold text-2xl tracking-tight">Schedule Showtime</h1>

		<p class="text-muted-foreground">Create a screening slot for a movie and auditorium.</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Showtime Details</Card.Title>
			<Card.Description> Choose the movie, auditorium, and screening time. </Card.Description>
		</Card.Header>

		<Card.Content>
			<form
				class="flex flex-col gap-6"
				onsubmit={(event) => {
	event.preventDefault()
	event.stopPropagation()
	form.handleSubmit()
}}
			>
				<div class="gap-4 grid grid-cols-1 md:grid-cols-2">
					<form.Field name="movieId">
						{#snippet children(
	field
)}
							<Field.Field>
								<Field.Label>Movie</Field.Label>

								<Select.Root
									type="single"
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value ?? '')}
								>
									<Select.Trigger class="w-full">
										{movies.data?.find((movie) => movie.id === field.state.value)?.title ?? 'Select movie'}
									</Select.Trigger>

									<Select.Content>
										{#each movies.data ?? [] as movie (movie.id)}
											<Select.Item value={movie.id}>
												{movie.title}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Field.Field>
						{/snippet}
					</form.Field>

					<form.Field name="cinemaId">
						{#snippet children(
	field
)}
							<Field.Field>
								<Field.Label>Cinema</Field.Label>

								<Select.Root
									type="single"
									value={field.state.value}
									onValueChange={(value) => {
	const cinemaId = value ?? ''

	field.handleChange(cinemaId)
	selectedCinemaId = cinemaId

	toast(selectedCinemaId)

	form.setFieldValue('auditoriumId', '')
}}
								>
									<Select.Trigger class="w-full">
										{cinemas.data?.find((cinema) => cinema.id === field.state.value)?.name ?? 'Select cinema'}
									</Select.Trigger>

									<Select.Content>
										{#each cinemas.data ?? [] as cinema (cinema.id)}
											<Select.Item value={cinema.id}>
												{cinema.name}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Field.Field>
						{/snippet}
					</form.Field>

					<form.Field name="auditoriumId">
						{#snippet children(
	field
)}
							<Field.Field>
								<Field.Label>Auditorium</Field.Label>

								<Select.Root
									type="single"
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value ?? '')}
									disabled={!selectedCinemaId}
								>
									<Select.Trigger class="w-full">
										{auditoriums.data?.find((auditorium) => auditorium.id === field.state.value)?.name ??
	'Select auditorium'}
									</Select.Trigger>

									<Select.Content>
										{#each auditoriums.data ?? [] as auditorium (auditorium.id)}
											<Select.Item value={auditorium.id}>
												{auditorium.name}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Field.Field>
						{/snippet}
					</form.Field>
				</div>

				<form.Field name="startTime">
					{#snippet children(
	field
)}
						<Field.Field>
							<Field.Label for="startTime"> Start time </Field.Label>

							<DateTimePicker
								id="startTime"
								value={field.state.value}
								onValueChange={(value) => value && field.handleChange(value)}
								minDate={new Date()}
							/>

							{#if field.state.meta.errors.length}
								<Field.Error errors={field.state.meta.errors} />
							{/if}
						</Field.Field>
					{/snippet}
				</form.Field>

				<Separator />

				<div>
					<h3 class="font-semibold text-sm">Turnover</h3>

					<p class="mt-1 text-muted-foreground text-sm">
						Time reserved between this screening and the next one.
					</p>
				</div>

				<form.Field name="turnoverBufferMinutes">
					{#snippet children(
	field
)}
						<Field.Field>
							<Field.Label for="turnoverBuffer"> Turnover buffer </Field.Label>

							<div class="flex items-center gap-2">
								<Input
									id="turnoverBuffer"
									class="max-w-32"
									type="number"
									min="0"
									step="1"
									value={field.state.value}
									oninput={(event) => field.handleChange(event.currentTarget.valueAsNumber)}
									onblur={field.handleBlur}
								/>

								<span class="text-muted-foreground text-sm"> minutes </span>
							</div>

							{#if field.state.meta.errors.length}
								<Field.Error errors={field.state.meta.errors} />
							{/if}
						</Field.Field>
					{/snippet}
				</form.Field>

				<div class="flex justify-end items-center gap-3 pt-4 border-t">
					<Button type="button" variant="ghost" onclick={handleCancel}> Cancel </Button>

					<Button type="submit" disabled={scheduleShowtime.isPending}>
						{scheduleShowtime.isPending ? 'Scheduling...' : 'Schedule Showtime'}
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
