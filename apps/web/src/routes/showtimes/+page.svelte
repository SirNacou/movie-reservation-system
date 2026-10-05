<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "@/components/ui/button/button.svelte";
	import * as Card from "@/components/ui/card";
	import { orpc } from "@/orpc";
	import { formatTime } from "@/utils/date-format";
	import { createQuery } from "@tanstack/svelte-query";

	const DAYS = 7;

	function startOfDay(date: Date) {
		const result = new Date(date);
		result.setHours(0, 0, 0, 0);
		return result;
	}

	function addDays(date: Date, days: number) {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		}).format(date);
	}

	function formatDateKey(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	}

	const today = startOfDay(new Date());
	const endDate = addDays(today, DAYS);

	const dates = Array.from({ length: DAYS }, (_, index) =>
		addDays(today, index),
	);

	const showtimes = createQuery(() =>
		orpc.showtimes.list.queryOptions({
			input: {
				from: today,
				to: endDate,
			},
		}),
	);

	type Showtime = NonNullable<typeof showtimes.data>[number];

	const movies = $derived(
		Array.from(
			new Map(
				(showtimes.data ?? []).map((showtime) => [
					showtime.movieId,
					{
						id: showtime.movieId,
						title: showtime.movieTitle,
						showtimes: (showtimes.data ?? []).filter(
							(item) => item.movieId === showtime.movieId,
						),
					},
				]),
			).values(),
		),
	);

	function showtimesForDate(movieShowtimes: Showtime[], date: Date) {
		const dateKey = formatDateKey(date);

		return movieShowtimes.filter(
			(showtime) => formatDateKey(showtime.startTime) === dateKey,
		);
	}
</script>

<div class="space-y-8 mx-auto max-w-6xl">
	<!-- Header -->
	<div class="space-y-2">
		<h1 class="font-bold text-3xl tracking-tight">Showtimes</h1>

		<p class="text-muted-foreground">Choose a movie and showtime.</p>
	</div>

	{#if showtimes.isPending}
		<div class="py-12 text-muted-foreground text-center">
			Loading showtimes...
		</div>
	{:else if showtimes.isError}
		<div class="py-12 text-destructive text-center">
			Failed to load showtimes.
		</div>
	{:else if movies.length === 0}
		<Card.Root>
			<Card.Content class="py-12 text-center">
				<p class="font-medium">No showtimes available</p>

				<p class="mt-1 text-muted-foreground text-sm">
					There are no screenings scheduled for the next 7 days.
				</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="space-y-8">
			{#each movies as movie (movie.id)}
				<Card.Root>
					<Card.Header>
						<Card.Title>{movie.title}</Card.Title>
					</Card.Header>

					<Card.Content class="space-y-8">
						{#each dates as date (formatDateKey(date))}
							{@const dayShowtimes = showtimesForDate(movie.showtimes, date)}

							{#if dayShowtimes.length > 0}
								<div class="space-y-3">
									<div class="flex items-center gap-3">
										<h3 class="font-semibold">
											{formatDate(date)}
										</h3>

										<div class="flex-1 border-t"></div>
									</div>

									<div class="space-y-3">
										{#each Map.groupBy(dayShowtimes, (showtime) => `${showtime.cinemaId}-${showtime.auditoriumId}`) as [_, cinemaShowtimes]}
											<div class="space-y-2">
												<div class="text-muted-foreground text-sm">
													{cinemaShowtimes[0].cinemaName}
													<span class="mx-1">·</span>
													{cinemaShowtimes[0].auditoriumName}
												</div>

												<div class="flex flex-wrap gap-3">
													{#each cinemaShowtimes as showtime (showtime.id)}
														<Button
															variant="outline"
															type="button"
															class="px-5 border-2 min-w-24 h-auto"
															onclick={() => goto(`/showtimes/${showtime.id}`)}
														>
															{formatTime(showtime.startTime)}
														</Button>
													{/each}
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						{/each}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
