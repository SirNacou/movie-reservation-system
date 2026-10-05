<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import AppSidebar from "@/components/app-sidebar.svelte";
	import ThemeToggle from "@/components/theme-toggle.svelte";
	import * as Sidebar from "@/components/ui/sidebar";
	import { Toaster } from "@/components/ui/sonner";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";

	let { children } = $props();

	const queryClient = new QueryClient();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Movie Reservation</title>
</svelte:head>

<Toaster />

<ModeWatcher />
<QueryClientProvider client={queryClient}>
	<Sidebar.Provider>
		<AppSidebar />
		<main class="w-full">
			<div class="flex justify-between px-2">
				<Sidebar.Trigger />
				<ThemeToggle />
			</div>
			<div class="px-4 py-2">
				{@render children()}
			</div>
		</main>
	</Sidebar.Provider>
	<SvelteQueryDevtools />
</QueryClientProvider>
