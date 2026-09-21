import { defineEnv } from 'envin';
import { z } from 'zod';

const env = defineEnv({
	server: {
		DATABASE_URL: z.url(),
	},
	env: process.env,
});

export default env;
