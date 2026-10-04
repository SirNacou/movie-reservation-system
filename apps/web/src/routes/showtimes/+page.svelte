<script lang="ts">
import { goto } from '$app/navigation'
import Button from '@/components/ui/button/button.svelte'
import * as Card from '@/components/ui/card'
import Input from '@/components/ui/input/input.svelte'
import { orpc } from '@/orpc'
import { formatTime } from '@/utils/date-format'
import { createQuery } from '@tanstack/svelte-query'

let selectedDate = $state(new Date().toISOString().slice(0, 10))

const showtimes = createQuery(() =>
	orpc.showtimes.list.queryOptions({
		input: {
			date: new Date(selectedDate),
		},
	})
)

const movies = $derived(
	Array.from(
		new Map(
			(showtimes.data ?? []).map((showtime) => [
				showtime.movieId,
				{
					id: showtime.movieId,
					title: showtime.movieTitle,
					showtimes: (showtimes.data ?? []).filter((item) => item.movieId === showtime.movieId),
				},
			])
		).values()
	)
)
</script>

<div class="space-y-8 mx-auto max-w-6xl">
	<!-- Header -->
	<div class="space-y-2">
		<h1 class="font-bold text-3xl tracking-tight">Showtimes</h1>

		<p class="text-muted-foreground">Choose a movie and showtime.</p>
	</div>

	<!-- Date -->
	<Card.Root>
		<Card.Content class="flex items-center gap-4 pt-6">
			<label for="date" class="font-medium"> Date </label>

			<Input id="date" class="w-45" type="date" bind:value={selectedDate} />
		</Card.Content>
	</Card.Root>

	<!-- Showtimes -->
	{#if showtimes.isPending}
		<div class="py-12 text-muted-foreground text-center">Loading showtimes...</div>
	{:else if showtimes.isError}
		<div class="py-12 text-destructive text-center">Failed to load showtimes.</div>
	{:else if movies.length === 0}
		<Card.Root>
			<Card.Content class="py-12 text-center">
				<p class="font-medium">No showtimes available</p>

				<p class="mt-1 text-muted-foreground text-sm">
					There are no screenings scheduled for this date.
				</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="space-y-6">
			{#each movies as movie (movie.id)}
				<Card.Root>
					<Card.Header>
						<Card.Title>{movie.title}</Card.Title>

						<Card.Description> Available showtimes </Card.Description>
					</Card.Header>

					<Card.Content>
						<div class="flex flex-wrap gap-3">
							{#each movie.showtimes as showtime (showtime.id)}
								<Button
									variant="outline"
									class="flex-col gap-0.5 py-3 min-w-24 h-auto"
									onclick={() => goto(`/showtimes/${showtime.id}`)}
								>
									<span class="font-semibold">
										{formatTime(showtime.startTime)}
									</span>

									<span class="text-muted-foreground text-xs">
										{showtime.cinemaName}
									</span>

									<span class="text-muted-foreground text-xs">
										{showtime.auditoriumName}
									</span>
								</Button>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
