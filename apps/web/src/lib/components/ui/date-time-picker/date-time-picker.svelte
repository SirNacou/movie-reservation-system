<script lang="ts">
import { Button, buttonVariants } from '$lib/components/ui/button/index.js'
import { Calendar } from '$lib/components/ui/calendar/index.js'
import { Input } from '$lib/components/ui/input/index.js'
import { Label } from '$lib/components/ui/label/index.js'
import * as Popover from '$lib/components/ui/popover/index.js'
import { cn } from '$lib/utils.js'
import { CalendarDate, type DateValue } from '@internationalized/date'
import CalendarIcon from '~icons/ph/calendar'
import ClockIcon from '~icons/ph/clock'

type Props = {
	/** Selected date and time. Bindable. */
	value?: Date
	id?: string
	/** Form field name. Renders a hidden input holding an ISO string. */
	name?: string
	label?: string
	description?: string
	/** Error message. Also sets aria-invalid on the trigger. */
	error?: string
	placeholder?: string
	disabled?: boolean
	required?: boolean
	/** Show a seconds segment in the time input. */
	showSeconds?: boolean
	/** Earliest selectable date (time of day is ignored). */
	minDate?: Date
	/** Latest selectable date (time of day is ignored). */
	maxDate?: Date
	/** Time used when a date is picked before any time is set. */
	defaultTime?: string
	locale?: string
	class?: string
	onValueChange?: (value: Date | undefined) => void
}

let {
	value = $bindable(),
	id = 'date-time-picker',
	name,
	label,
	description,
	error,
	placeholder = 'Pick a date and time',
	disabled = false,
	required = false,
	showSeconds = false,
	minDate,
	maxDate,
	defaultTime = '09:00',
	locale = 'en-US',
	class: className,
	onValueChange,
}: Props = $props()

let open = $state(false)
// svelte-ignore state_referenced_locally
let pendingTime = $state(defaultTime)

const pad = (n: number) => String(n).padStart(2, '0')

const toCalendarDate = (d: Date) => new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())

const calendarValue = $derived(value ? toCalendarDate(value) : undefined)
const minValue = $derived(minDate ? toCalendarDate(minDate) : undefined)
const maxValue = $derived(maxDate ? toCalendarDate(maxDate) : undefined)

const timeValue = $derived(
	value
		? `${pad(value.getHours())}:${pad(value.getMinutes())}` +
				(showSeconds ? `:${pad(value.getSeconds())}` : '')
		: pendingTime
)

const formatted = $derived(
	value
		? new Intl.DateTimeFormat(locale, {
				dateStyle: 'medium',
				timeStyle: showSeconds ? 'medium' : 'short',
			}).format(value)
		: ''
)

function parseTime(t: string): [number, number, number] {
	const [h = 0, m = 0, s = 0] = t.split(':').map((n) => Number(n) || 0)
	return [h, m, s]
}

function commit(next: Date | undefined) {
	value = next
	onValueChange?.(next)
}

function handleDateChange(date: DateValue | undefined) {
	if (!date) return commit(undefined)
	const [h, m, s] = parseTime(timeValue)
	commit(new Date(date.year, date.month - 1, date.day, h, m, s))
}

function handleTimeChange(e: Event & { currentTarget: HTMLInputElement }) {
	const t = e.currentTarget.value
	if (!t) return
	pendingTime = t
	if (!value) return
	const [h, m, s] = parseTime(t)
	const next = new Date(value)
	next.setHours(h, m, s, 0)
	commit(next)
}

function clear() {
	pendingTime = defaultTime
	commit(undefined)
	open = false
}

const errorId = $derived(`${id}-error`)
const descriptionId = $derived(`${id}-description`)
</script>

<div class={cn('gap-2 grid w-full', className)}>
	{#if label}
		<Label for={id}>
			{label}
			{#if required}
				<span class="text-destructive" aria-hidden="true">*</span>
			{/if}
		</Label>
	{/if}

	<Popover.Root bind:open>
		<Popover.Trigger
			{id}
			{disabled}
			aria-invalid={error ? true : undefined}
			aria-describedby={error ? errorId : description ? descriptionId : undefined}
			class={cn(
	buttonVariants({ variant: 'outline' }),
	'w-full justify-start text-left font-normal',
	!value && 'text-muted-foreground',
	error && 'border-destructive'
)}
		>
			<CalendarIcon class="mr-2 size-4" />
			{formatted || placeholder}
		</Popover.Trigger>

		<Popover.Content class="p-0 w-auto" align="start">
			<Calendar
				type="single"
				value={calendarValue}
				onValueChange={handleDateChange}
				{minValue}
				{maxValue}
				captionLayout="dropdown"
				initialFocus
			/>

			<div class="flex items-center gap-2 p-3 border-t">
				<ClockIcon class="size-4 text-muted-foreground shrink-0" />
				<Label for="{id}-time" class="sr-only">Time</Label>
				<Input
					id="{id}-time"
					type="time"
					step={showSeconds ? 1 : 60}
					value={timeValue}
					onchange={handleTimeChange}
					class="[&::-webkit-calendar-picker-indicator]:hidden bg-background appearance-none [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>

			<div class="flex justify-between gap-2 p-3 border-t">
				<Button variant="ghost" size="sm" onclick={clear} disabled={!value}>Clear</Button>
				<Button size="sm" onclick={() => (open = false)}>Done</Button>
			</div>
		</Popover.Content>
	</Popover.Root>

	{#if name}
		<input type="hidden" {name} value={value ? value.toISOString() : ''}>
	{/if}

	{#if error}
		<p id={errorId} class="font-medium text-destructive text-sm">{error}</p>
	{:else if description}
		<p id={descriptionId} class="text-muted-foreground text-sm">{description}</p>
	{/if}
</div>
