<script lang="ts">
import type { RouteId } from '$app/types'
import PageHeader from '@/components/page-header.svelte'
import Button from '@/components/ui/button/button.svelte'
import * as Table from '@/components/ui/table/index'
import { orpc } from '@/orpc'
import { createQuery } from '@tanstack/svelte-query'
import AddPlusIcon from '~icons/ci/add-plus'

const listCinemasQuery = createQuery(() => orpc.cinemas.list.queryOptions())
</script>

<PageHeader title="Cinemas">
	<Button href={'/cinemas/create' as RouteId}>
		<AddPlusIcon />
		Cinema
	</Button>
</PageHeader>

<Table.Root>
	<Table.Caption></Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>City</Table.Head>
			<Table.Head>Address</Table.Head>
			<Table.Head>Action</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each listCinemasQuery.data as cinema (cinema.id)}
			<Table.Row>
				<Table.Cell>{cinema.name}</Table.Cell>
				<Table.Cell>{cinema.city}</Table.Cell>
				<Table.Cell>{cinema.address}</Table.Cell>
				<Table.Cell>
					<Button>None</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
