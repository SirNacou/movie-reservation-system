import { defineEnv } from 'envin';
import { z } from 'zod';

export const env = defineEnv({
	server: {
		DATABASE_URL: z.url(),
		REDIS_HOST: z.string(),
		REDIS_PORT: z.coerce.number().int().positive(),
		NODE_ENV: z.enum(['development', 'production']).default('development'),
		TMDB_API_KEY: z.string(),
	},
	env: process.env,
	isServer: true,
});

export type Env = typeof env;
