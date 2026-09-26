<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'
import { cn, type WithElementRef } from '$lib/utils.js'

let {
	ref = $bindable(null),
	class: className,
	showOnHover = false,
	children,
	child,
	...restProps
}: WithElementRef<HTMLButtonAttributes> & {
	child?: Snippet<[{ props: Record<string, unknown> }]>
	showOnHover?: boolean
} = $props()

const mergedProps = $derived({
	class: cn(
		'md:after:hidden group-data-[collapsible=icon]:hidden top-1.5 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 right-1 absolute after:absolute after:-inset-2 flex justify-center items-center hover:bg-sidebar-accent p-0 rounded-xl outline-hidden ring-sidebar-ring focus-visible:ring-3 w-5 [&>svg]:size-4 aspect-square text-sidebar-foreground transition-transform hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:shrink-0',
		showOnHover &&
			'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0',
		className
	),
	'data-slot': 'sidebar-menu-action',
	'data-sidebar': 'menu-action',
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
