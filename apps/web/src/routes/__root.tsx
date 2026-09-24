import { TanStackDevtools } from "@tanstack/solid-devtools";
import { createRootRoute, Outlet } from "@tanstack/solid-router";

import "../styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtoolsPanel } from "@tanstack/solid-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/solid-router-devtools";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
			<TanStackDevtools
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
					{
						name: "TanStack Query",
						render: <SolidQueryDevtoolsPanel />,
					},
				]}
			></TanStackDevtools>
		</QueryClientProvider>
	);
}
