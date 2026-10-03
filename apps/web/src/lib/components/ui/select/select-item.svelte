<script lang="ts">
import { cn, type WithoutChild } from '$lib/utils.js'
import { Select as SelectPrimitive } from 'bits-ui'
import RiCheckLine from 'remixicon-svelte/icons/check-line'

let {
	ref = $bindable(null),
	class: className,
	value,
	label,
	children: childrenProp,
	...restProps
}: WithoutChild<SelectPrimitive.ItemProps> = $props()
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	{label}
	data-slot="select-item"
	class={cn(
	"focus:bg-accent focus:text-accent-foreground gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",

	"data-highlighted:bg-muted data-highlighted:text-foreground data-highlighted:ring-1 data-highlighted:ring-border",

	className
)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="right-2 absolute flex justify-center items-center size-4 pointer-events-none">
			{#if selected}
				<RiCheckLine class="pointer-events-none" />
			{/if}
		</span>
		<span class="flex flex-1 gap-2 whitespace-nowrap shrink-0">
			{#if childrenProp}
				{@render childrenProp({ selected, highlighted })}
			{:else}
				{label || value}
			{/if}
		</span>
	{/snippet}
</SelectPrimitive.Item>
