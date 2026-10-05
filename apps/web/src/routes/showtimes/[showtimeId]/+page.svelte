<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import Button from '@/components/ui/button/button.svelte';
    import * as Card from '@/components/ui/card';
    import Input from '@/components/ui/input/input.svelte';
    import Label from '@/components/ui/label/label.svelte';
    import Separator from '@/components/ui/separator/separator.svelte';
    import { orpc } from '@/orpc';
    import { getApiErrorMessage } from '@/utils/api-error';
    import { createMutation, createQuery } from '@tanstack/svelte-query';
    import { toast } from 'svelte-sonner';

const showtimeId = page.params.showtimeId!

let customerName = $state('')
let customerEmail = $state('')
let selectedSeatIds = $state<string[]>([])

const seats = createQuery(() =>
	orpc.reservations.listShowtimeSeats.queryOptions({
		input: {
			showtimeId,
		},
	})
)

type Seat = NonNullable<typeof seats.data>[number]

const rows = $derived(Map.groupBy(seats.data ?? [], (seat) => seat.row))
const selected = $derived(new Set(selectedSeatIds))

function isUnavailable(seat: Seat) {
	return seat.status !== 'AVAILABLE'
}

function seatClass(seat: Seat) {
	return [
		'h-12 w-12 rounded-md border text-sm font-medium transition-colors',
		isUnavailable(seat) &&
			'cursor-not-allowed border-muted-foreground/40 bg-muted-foreground/20 text-muted-foreground',
		!isUnavailable(seat) && !selected.has(seat.id) && 'border-border bg-background hover:bg-accent',
		!isUnavailable(seat) &&
			selected.has(seat.id) &&
			'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
	]
}

const createReservation = createMutation(() =>
	orpc.reservations.create.mutationOptions({
		onSuccess: async (reservation) => {
			await goto(`/reservations/${reservation.id}`)
		},
		onError: (error) => toast.error(getApiErrorMessage(error)),
	})
)

function toggleSeat(seatId: string) {
	if (selectedSeatIds.includes(seatId)) {
		selectedSeatIds = selectedSeatIds.filter((id) => id !== seatId)
	} else {
		selectedSeatIds = [...selectedSeatIds, seatId]
	}
}

function reserve() {
	if (selectedSeatIds.length === 0) return
	if (!customerEmail.trim()) return

	createReservation.mutate({
		showtimeId,
		customerEmail,
		customerName: customerName.trim() || undefined,
		seatIds: selectedSeatIds,
	})
}
</script>

<div class="space-y-6 mx-auto">
	<!-- Header -->
	<div>
		<h1 class="font-semibold text-2xl tracking-tight">Reserve Seats</h1>
		<p class="text-muted-foreground">Select your seats and enter your contact information.</p>
	</div>

	<div class="gap-6 grid lg:grid-cols-[1fr_320px]">
		<!-- Seat selection -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Select Seats</Card.Title>
				<Card.Description> Choose the seats you want to reserve. </Card.Description>
			</Card.Header>

			<Card.Content class="space-y-6">
				<!-- Screen -->
				<div class="space-y-2">
					<div class="bg-muted-foreground/30 mx-auto rounded-full max-w-xl h-2"></div>

					<p class="text-muted-foreground text-sm text-center">Screen</p>
				</div>

				<!-- Seats -->
				{#if seats.isPending}
					<div class="py-12 text-muted-foreground text-center">Loading seats...</div>
				{:else if seats.isError}
					<div class="py-12 text-destructive text-center">Failed to load seats.</div>
				{:else}
					<div class="flex flex-col items-center gap-3">
						{#each rows as [row, rowSeats] (row)}
							<div class="flex items-center gap-2">
								<span class="w-6 text-muted-foreground text-sm text-right">{row}</span>

								<div class="flex gap-2">
									{#each rowSeats as seat (seat.id)}
										<button
											type="button"
											disabled={isUnavailable(seat)}
											aria-pressed={selected.has(seat.id)}
											onclick={() => toggleSeat(seat.id)}
											class={seatClass(seat)}
										>
											{seat.number}
										</button>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Legend -->
				<div class="flex justify-center gap-6 text-sm">
					<div class="flex items-center gap-2">
						<div class="bg-background border rounded w-4 h-4"></div>
						<span>Available</span>
					</div>

					<div class="flex items-center gap-2">
						<div class="bg-primary rounded w-4 h-4"></div>
						<span>Selected</span>
					</div>

					<div class="flex items-center gap-2">
						<div class="bg-muted rounded w-4 h-4"></div>
						<span>Reserved</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Reservation details -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Reservation</Card.Title>
				<Card.Description> Your seats will be held for 10 minutes. </Card.Description>
			</Card.Header>

			<Card.Content class="space-y-5">
				<div class="space-y-2">
					<Label for="name">Name</Label>

					<Input id="name" bind:value={customerName} placeholder="Your name" />
				</div>

				<div class="space-y-2">
					<Label for="email">Email</Label>

					<Input id="email" type="email" bind:value={customerEmail} placeholder="you@example.com" />
				</div>

				<Separator />

				<div class="space-y-2">
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Selected seats</span>
						<span class="font-medium">{selectedSeatIds.length}</span>
					</div>

					{#if selectedSeatIds.length > 0}
						<div class="text-muted-foreground text-sm">
							{selectedSeatIds.length}
							seat{selectedSeatIds.length === 1 ? '' : 's'}
							selected
						</div>
					{:else}
						<p class="text-muted-foreground text-sm">No seats selected</p>
					{/if}
				</div>

				<Button
					class="w-full"
					disabled={selectedSeatIds.length === 0 || !customerEmail.trim() || createReservation.isPending}
					onclick={reserve}
				>
					{createReservation.isPending ? 'Reserving...' : 'Reserve Seats'}
				</Button>

				{#if createReservation.isError}
					<p class="text-destructive text-sm">
						{getApiErrorMessage(createReservation.error)}
					</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
