<script lang="ts">
import { cn, type WithElementRef } from '$lib/utils.js'
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

type FormError = string | { message?: string } | undefined | null

let {
	ref = $bindable(null),
	class: className,
	children,
	errors,
	...restProps
}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
	children?: Snippet
	errors?: FormError[]
} = $props()

const normalizedErrors = $derived.by(() => {
	if (!errors) return []
	return errors
		.map((err) => {
			if (typeof err === 'string') return err
			return err?.message || ''
		})
		.filter((msg) => msg.length > 0)
})

const hasContent = $derived(children || normalizedErrors.length > 0)
const isMultipleErrors = $derived(errors && errors.length > 1)
const singleErrorMessage = $derived(normalizedErrors.length === 1 ? normalizedErrors[0] : '')
</script>

{#if hasContent}
	<div
		bind:this={ref}
		role="alert"
		data-slot="field-error"
		class={cn('font-normal text-destructive text-sm', className)}
		{...restProps}
	>
		{#if children}
			{@render children()}
		{:else if singleErrorMessage}
			{singleErrorMessage}
		{:else if isMultipleErrors}
			<ul class="flex flex-col gap-1 ml-4 list-disc">
				{#each normalizedErrors as error, index (index)}
					<li>{error}</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}
