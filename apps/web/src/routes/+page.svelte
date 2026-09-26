<script lang="ts">
import { createQuery } from '@tanstack/svelte-query'
import { orpc } from '@/orpc'

const moviesQuery = createQuery(() => orpc.movies.list.queryOptions())
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<ul>
	{#each moviesQuery.data as movie}
		<li>{movie.name}</li>
	{/each}
</ul>
