<script lang="ts">
import * as Card from '@/components/ui/card/index'
import type { ApiOutputs } from '@/types'
import { buildTmdbImageUrl } from '@/utils/tmdb'

type Props = {
	movie: ApiOutputs['movies']['list'][number]
}

const { movie }: Props = $props()

const posterUrl = $derived(() => buildTmdbImageUrl(movie.poster_url))
</script>

<Card.Root class="group pt-0 w-full overflow-hidden">
	<img
		src={posterUrl()}
		alt={movie.title}
		class="w-full object-cover aspect-2/3 group-hover:scale-105 transition-transform duration-300"
	>
	<Card.Header class="gap-1 p-3">
		<Card.Title class="text-base truncate">
			{movie.title}
		</Card.Title>
	</Card.Header>
</Card.Root>
