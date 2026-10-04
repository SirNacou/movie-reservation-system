<script lang="ts">
import { goto } from '$app/navigation'
import Button from '@/components/ui/button/button.svelte'
import * as Card from '@/components/ui/card'
import Input from '@/components/ui/input/input.svelte'
import * as Select from '@/components/ui/select'
import * as Table from '@/components/ui/table'
import { orpc } from '@/orpc'
import { formatDateTime, formatDuration, formatTime } from '@/utils/date-format'
import { createQuery } from '@tanstack/svelte-query'

let selectedCinemaId = $state('')
let selectedMovieId = $state('')
let selectedDate = $state('')

const showtimes = createQuery(() =>
	orpc.showtimes.list.queryOptions({
		input: {
			cinemaId: selectedCinemaId || undefined,
			movieId: selectedMovieId || undefined,
			date: selectedDate ? new Date(selectedDate) : undefined,
		},
	})
)
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="font-semibold text-2xl tracking-tight">Showtimes</h1>

			<p class="text-muted-foreground">Manage scheduled movie screenings.</p>
		</div>

		<Button onclick={() => goto('/admin/showtimes/schedule')}> Schedule Showtime </Button>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Showtimes</Card.Title>
			<Card.Description> View and manage scheduled screenings. </Card.Description>
		</Card.Header>

		<Card.Content class="space-y-4">
			<!-- Filters -->
			<div class="flex flex-wrap gap-3">
				<Input class="w-45" type="date" bind:value={selectedDate} />

				<Select.Root
					type="single"
					value={selectedCinemaId}
					onValueChange={(value) => {
	selectedCinemaId = value ?? ''
}}
				>
					<Select.Trigger class="w-50"> Select cinema </Select.Trigger>

					<Select.Content>
						<!-- cinemas -->
					</Select.Content>
				</Select.Root>

				<Select.Root
					type="single"
					value={selectedMovieId}
					onValueChange={(value) => {
	selectedMovieId = value ?? ''
}}
				>
					<Select.Trigger class="w-55"> Select movie </Select.Trigger>

					<Select.Content>
						<!-- movies -->
					</Select.Content>
				</Select.Root>

				<Button
					variant="outline"
					onclick={() => {
	selectedDate = ''
	selectedCinemaId = ''
	selectedMovieId = ''
}}
				>
					Clear
				</Button>
			</div>

			<!-- Table -->
			<div class="border rounded-xl">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Movie</Table.Head>
							<Table.Head>Date & Time</Table.Head>
							<Table.Head>Cinema</Table.Head>
							<Table.Head>Auditorium</Table.Head>
							<Table.Head>Duration</Table.Head>
							<Table.Head>End Time</Table.Head>
							<Table.Head class="w-20"></Table.Head>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{#each showtimes.data ?? [] as showtime (showtime.id)}
							<Table.Row>
								<Table.Cell>
									{showtime.movieTitle}
								</Table.Cell>

								<Table.Cell>
									{formatDateTime(showtime.startTime)}
								</Table.Cell>

								<Table.Cell>
									{showtime.cinemaName}
								</Table.Cell>

								<Table.Cell>
									{showtime.auditoriumName}
								</Table.Cell>

								<Table.Cell>
									{formatDuration(showtime.durationMinutes)}
								</Table.Cell>

								<Table.Cell>
									{formatTime(showtime.endTime)}
								</Table.Cell>

								<Table.Cell> ... </Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>
</div>
