<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'
import { cn, type WithElementRef } from '$lib/utils.js'
import { useSidebar } from './context.svelte.js'

let {
	ref = $bindable(null),
	class: className,
	children,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> = $props()

const sidebar = useSidebar()
</script>

<button
	type="button"
	bind:this={ref}
	data-sidebar="rail"
	data-slot="sidebar-rail"
	aria-label="Toggle Sidebar"
	tabindex={-1}
	onclick={sidebar.toggle}
	title="Toggle Sidebar"
	class={cn(
	'hidden group-data-[side=left]:-right-4 group-data-[side=right]:left-0 z-20 absolute after:absolute inset-y-0 after:inset-y-0 sm:flex hover:after:bg-sidebar-border w-4 after:w-[2px] transition-all ltr:-translate-x-1/2 rtl:-translate-x-1/2 ease-linear after:start-1/2',
	'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
	'[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
	'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
	'[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
	'[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
	className
)}
	{...restProps}
>
	{@render children?.()}
</button>
