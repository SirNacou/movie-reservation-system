<script lang="ts">
import type { Snippet } from 'svelte'
import type { HTMLAnchorAttributes } from 'svelte/elements'
import { cn, type WithElementRef } from '$lib/utils.js'

let {
	ref = $bindable(null),
	children,
	child,
	class: className,
	size = 'md',
	isActive = false,
	...restProps
}: WithElementRef<HTMLAnchorAttributes> & {
	child?: Snippet<[{ props: Record<string, unknown> }]>
	size?: 'sm' | 'md'
	isActive?: boolean
} = $props()

const mergedProps = $derived({
	class: cn(
		'group-data-[collapsible=icon]:hidden flex items-center gap-2 data-active:bg-sidebar-accent hover:bg-sidebar-accent active:bg-sidebar-accent aria-disabled:opacity-50 disabled:opacity-50 px-3 rounded-xl outline-hidden ring-sidebar-ring focus-visible:ring-3 min-w-0 h-7 [&>svg]:size-4 overflow-hidden text-sidebar-foreground data-[size=sm]:text-xs data-[size=md]:text-sm [&>span:last-child]:truncate -translate-x-px [&>svg]:text-sidebar-accent-foreground data-active:text-sidebar-accent-foreground hover:text-sidebar-accent-foreground active:text-sidebar-accent-foreground aria-disabled:pointer-events-none disabled:pointer-events-none [&>svg]:shrink-0',
		className
	),
	'data-slot': 'sidebar-menu-sub-button',
	'data-sidebar': 'menu-sub-button',
	'data-size': size,
	'data-active': isActive,
	...restProps,
})
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a bind:this={ref} href={mergedProps.href} {...mergedProps}> {@render children?.()} </a>
{/if}
