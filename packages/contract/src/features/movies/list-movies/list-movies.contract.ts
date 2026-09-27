import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

const MovieSchema = z.object({
	id: z.uuidv7(),
	title: z.string(),
	description: z.string().default(''),
	poster_url: z.string(),
	duration_Minutes: z.number().int().gte(0),
})

export const listMoviesContract = oc
	.meta(openapi({ path: '/movies', method: 'GET' }))
	.output(z.array(MovieSchema))
