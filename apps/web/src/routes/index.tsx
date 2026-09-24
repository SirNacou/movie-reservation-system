import { useMutation, useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { orpc } from "../lib/orpc";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { data, refetch } = useQuery(() => orpc.movies.list.queryOptions());
	const useSyncTmdb = useMutation(() =>
		orpc.movies.syncTmdb.mutationOptions({
			onSuccess: async () => {
				await refetch();
			},
		})
	);

	async function handleClick() {
		const res = await useSyncTmdb.mutateAsync({
			page: 1,
		});

		console.log(res.message);
	}
	return (
		<div class="p-8">
			<h1 class="font-bold text-4xl">Welcome to TanStack Start</h1>
			<p class="mt-4 text-lg">
				Edit <code>src/routes/index.tsx</code> to get started.
			</p>
			<ul>
				{data?.map((d) => (
					<li>
						{d.id} - {d.name}
					</li>
				))}
			</ul>

			<button type="button" on:click={handleClick}>
				Click
			</button>
		</div>
	);
}
