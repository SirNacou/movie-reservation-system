<script lang="ts">
import { resolve } from '$app/paths'
import { page } from '$app/state'
import type { RouteId } from '$app/types'
import PageHeader from '@/components/page-header.svelte'
import Button from '@/components/ui/button/button.svelte'
import { orpc } from '@/orpc'
import { createQuery } from '@tanstack/svelte-query'
import AddAuditoriumDialog from '../../../../lib/features/cinemas/add-auditorium-dialog.svelte'

const cinemaQuery = createQuery(() =>
	orpc.cinemas.get.queryOptions({ input: { id: page.params.cinemaId! } })
)

const formatDate = (date: Date | string) => {
	const value = date instanceof Date ? date : new Date(date)
	if (Number.isNaN(value.getTime())) return 'Unknown'

	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(value)
}
</script>

<PageHeader title={cinemaQuery.data?.name ?? 'Cinema details'} description={cinemaQuery.data?.city}>
	<Button href={'/cinemas' as RouteId} variant="outline">Back to cinemas</Button>
</PageHeader>

{#if cinemaQuery.isLoading}
	<p class="text-muted-foreground" role="status">Loading cinema details…</p>
{:else if cinemaQuery.isError}
	<div class="space-y-3" role="alert">
		<p>Unable to load this cinema: {cinemaQuery.error.message}</p>
		<Button variant="outline" onclick={() => cinemaQuery.refetch()}>Try again</Button>
	</div>
{:else if cinemaQuery.data}
	<div class="space-y-8">
		<section class="gap-4 grid sm:grid-cols-2" aria-label="Cinema information">
			<div class="bg-card p-5 border rounded-lg">
				<h2 class="font-medium text-muted-foreground text-sm">Address</h2>
				<p class="mt-2 font-medium">{cinemaQuery.data.address}</p>
				<p class="text-muted-foreground">{cinemaQuery.data.city}</p>
			</div>
			<div class="bg-card p-5 border rounded-lg">
				<h2 class="font-medium text-muted-foreground text-sm">Auditoriums</h2>
				<p class="mt-2 font-medium">{cinemaQuery.data.auditoriums.length}</p>
				<p class="text-muted-foreground">
					{cinemaQuery.data.auditoriums.reduce((total, auditorium) => total + auditorium.totalSeats, 0)}
					total seats
				</p>
			</div>
		</section>

		<section aria-labelledby="auditoriums-heading">
			<div class="flex justify-between items-start gap-4 mb-4">
				<div>
					<h2 id="auditoriums-heading" class="font-semibold text-xl">Auditoriums</h2>
					<p class="text-muted-foreground text-sm">Rooms and seating capacity at this cinema.</p>
				</div>
				<AddAuditoriumDialog
					cinemaId={page.params.cinemaId!}
					onSuccess={() => cinemaQuery.refetch()}
				/>
			</div>

			{#if cinemaQuery.data.auditoriums.length > 0}
				<ul class="border rounded-lg divide-y">
					{#each cinemaQuery.data.auditoriums as auditorium (auditorium.id)}
						<li class="flex justify-between items-center gap-4 p-4">
							<div>
								<h3 class="font-medium">{auditorium.name}</h3>
								<p class="text-muted-foreground text-sm">{auditorium.totalSeats} seats</p>
							</div>

							<Button
								variant="outline"
								size="sm"
								href={resolve('/admin/cinemas/[cinemaId]/auditoriums/[auditoriumId]/layout', {
	cinemaId: page.params.cinemaId!,
	auditoriumId: auditorium.id,
})}
							>
								Configure seats
							</Button>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="p-6 border border-dashed rounded-lg text-muted-foreground text-center">
					No auditoriums have been added to this cinema yet.
				</p>
			{/if}
		</section>

		<p class="text-muted-foreground text-sm">
			Created {formatDate(cinemaQuery.data.createdAt)} · Updated
			{formatDate(cinemaQuery.data.updatedAt)}
		</p>
	</div>
{/if}
