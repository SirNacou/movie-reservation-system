<script lang="ts">
import MovieCard from '@/components/movie-card.svelte'
import PageHeader from '@/components/page-header.svelte'
import { orpc } from '@/orpc'
import { createQuery } from '@tanstack/svelte-query'

const moviesQuery = createQuery(() => orpc.movies.list.queryOptions())
</script>

<PageHeader title="Home" />

<div class="gap-4 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
	{#each moviesQuery.data as movie (movie.id)}
		<MovieCard {movie} />
	{/each}
</div>
