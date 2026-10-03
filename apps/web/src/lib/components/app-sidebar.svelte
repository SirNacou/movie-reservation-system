<script lang="ts">
import type { RouteId } from '$app/types'
import * as Sidebar from '$lib/components/ui/sidebar/index.js'
import type { Component } from 'svelte'
import HomeIcon from '~icons/akar-icons/home'
import VenueDuotoneBoldIcon from '~icons/iconmind/venue-duotone-bold'
import FilmMovieProjectorIcon from '~icons/pinhead/film-movie-projector'

type NavGroup = {
	name: string
	items: NavItem[]
}

type NavItem = {
	title: string
	href: RouteId
	icon: Component
}

const groups: NavGroup[] = [
	{
		name: 'Cinema',
		items: [
			{
				title: 'Home',
				href: '/',
				icon: HomeIcon,
			},
			{
				title: 'Cinemas',
				href: '/cinemas',
				icon: VenueDuotoneBoldIcon,
			},
			{
				title: 'Showtimes',
				href: '/showtimes',
				icon: FilmMovieProjectorIcon,
			},
		],
	},
]
</script>

{#snippet navGroup({
	name,
	items,
}: NavGroup)}
	<Sidebar.Group>
		<Sidebar.GroupLabel>{name}</Sidebar.GroupLabel>
		<Sidebar.GroupContent>
			<Sidebar.Menu>
				{#each items as item (item.title)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({
	props,
})}
								<a href={item.href} {...props}>
									<item.icon />
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{/snippet}

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					<span class="font-bold text-lg uppercase">Movie Reservation</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each groups as group}
			{@render navGroup(group)}
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
