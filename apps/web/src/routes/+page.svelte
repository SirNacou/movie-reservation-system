<script lang="ts">
import PageHeader from '@/components/page-header.svelte'
import { orpc } from '@/orpc'
import { createQuery } from '@tanstack/svelte-query'

const moviesQuery = createQuery(() => orpc.movies.list.queryOptions())
</script>

<PageHeader title="Home" />

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<ul>
	{#each moviesQuery.data as movie}
		<li>{movie.name}</li>
	{/each}
</ul>
