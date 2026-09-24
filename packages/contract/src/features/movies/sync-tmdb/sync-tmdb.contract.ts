import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";

const SyncTmdbRequest = z.object({
	page: z.number().int().positive().min(1).default(1).optional(),
});

const SyncTmdbResponse = z.object({
	message: z.string(),
});

export const syncTmdbContract = oc
	.meta(openapi({ path: "/movies/sync-tmdb", method: "POST" }))
	.input(SyncTmdbRequest)
	.output(SyncTmdbResponse);
