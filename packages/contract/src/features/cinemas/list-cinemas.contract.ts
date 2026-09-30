import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'

export const CinemaResponseSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	city: z.string(),
	address: z.string(),
})

export const listCinemasContract = oc
	.meta(openapi({ path: '/cinemas', method: 'GET' }))
	.output(z.array(CinemaResponseSchema))
