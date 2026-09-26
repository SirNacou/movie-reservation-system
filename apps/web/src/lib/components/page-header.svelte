<script lang="ts">
import type { Snippet } from 'svelte'

interface Props {
	title: string
	description?: string
	children?: Snippet
}

let { title, description, children }: Props = $props()
</script>

<header class="mb-8 pb-4 border-gray-300 dark:border-gray-700 border-b">
	<div class="flex justify-between items-start gap-4">
		<div class="min-w-0">
			<h1 class="font-bold text-3xl tracking-tight">
				{title}
			</h1>

			{#if description}
				<p class="mt-1 text-gray-600 dark:text-gray-400 text-sm">
					{description}
				</p>
			{/if}
		</div>

		{#if children}
			<div class="shrink-0">
				{@render children()}
			</div>
		{/if}
	</div>
</header>
