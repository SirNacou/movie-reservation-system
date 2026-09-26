import { defineEnv } from 'envin'
import { z } from 'zod'
import * as dynamicPrivate from '$env/dynamic/private'
import * as dynamicPublic from '$env/dynamic/public'

export const env = defineEnv({
	clientPrefix: 'PUBLIC_',
	client: {
		PUBLIC_API_URL: z.url(),
		PUBLIC_WEB_PORT: z.coerce.number().int().positive(),
	},
	env: {
		...dynamicPrivate.env,
		...dynamicPublic.env,
	},
})
