import { createORPCClient } from "@orpc/client";
import type { RouterContractClient } from "@orpc/contract";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { contract } from "@repo/contract";

const link = new OpenAPILink(contract, {
	url: "/api",
});

const client: RouterContractClient<typeof contract> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client)
