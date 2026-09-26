import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

const MovieSchema = z.object({
	id: z.uuidv7(),
	name: z.string(),
})

export const listMoviesContract = oc
	.meta(openapi({ path: '/movies', method: 'GET' }))
	.output(z.array(MovieSchema))
