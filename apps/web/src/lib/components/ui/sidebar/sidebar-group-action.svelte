<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'
import { cn, type WithElementRef } from '$lib/utils.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	child,
	...restProps
}: WithElementRef<HTMLButtonAttributes> & {
	child?: Snippet<[{ props: Record<string, unknown> }]>
} = $props()

const mergedProps = $derived({
	class: cn(
		'md:after:hidden group-data-[collapsible=icon]:hidden top-3.5 right-3 absolute after:absolute after:-inset-2 flex justify-center items-center hover:bg-sidebar-accent p-0 rounded-xl outline-hidden ring-sidebar-ring focus-visible:ring-3 w-5 [&>svg]:size-4 aspect-square text-sidebar-foreground transition-transform hover:text-sidebar-accent-foreground [&>svg]:shrink-0',
		className
	),
	'data-slot': 'sidebar-group-action',
	'data-sidebar': 'group-action',
	...restProps,
})
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button type="button" bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
