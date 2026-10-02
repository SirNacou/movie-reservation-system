<script lang="ts">
import AuditoriumConfigCard from '@/features/cinemas/auditorium-config-card.svelte'
import AuditoriumLayoutCard, {
	type SeatDefinition,
} from '@/features/cinemas/auditorium-layout-card.svelte'
import { toast } from 'svelte-sonner'

async function handleSeatSelected(seat: SeatDefinition) {}
</script>

<div class="flex gap-3">
	<AuditoriumConfigCard
		rootClass="flex-1"
		rowChanged={(rows) => toast(`Rows changed: ${rows}`)}
		seatsPerRowChanged={(seatsPerRow) => toast(`Seats per row changed: ${seatsPerRow}`)}
	/>

	<AuditoriumLayoutCard
		rootClass="flex-3"
		title="Auditorium Layout"
		description="Preview the layout of the auditorium."
		seats={[
	{ row: 'A', number: 1, type: 'REGULAR' },
	{ row: 'A', number: 2, type: 'REGULAR' },
	{ row: 'A', number: 3, type: 'VIP' },
	{ row: 'B', number: 1, type: 'ACCESSIBLE' },
	{ row: 'B', number: 2, type: 'COUPLE' },
]}
		seatSelected={handleSeatSelected}
	/>
</div>
