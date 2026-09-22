import { defineEnv } from 'envin';
import { z } from 'zod';

const env = defineEnv({
	server: {
		DATABASE_URL: z.url(),
		REDIS_HOST: z.string(),
		REDIS_PORT: z.coerce.number().int().positive(),
		NODE_ENV: z.enum(['development', 'production']).default('development'),
	},
	env: process.env,
	isServer: true,
});

export default env;
