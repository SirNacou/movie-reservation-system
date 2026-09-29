import { oc } from '@orpc/contract'
import { openapi } from '@orpc/openapi'
import { z } from 'zod'
import { CinemaResponseSchema } from './list.contract.js'

export const ErrorSchema = z.object({
	error: z.string(),
})

export const createCinemaRequest = z.object({
	name: z.string().min(3),
	city: z.string().min(3),
	address: z.string().min(5),
})
export const createCinemaContract = oc
	.meta(openapi({ path: '/cinemas', method: 'POST' }))
	.input(createCinemaRequest)
	.output(CinemaResponseSchema)
