import { createORPCClient } from '@orpc/client'
import type {
	InferContractRouterInputs,
	InferRouterContractOutputs,
	RouterContractClient,
} from '@orpc/contract'
import { SmartCoercionLinkPlugin } from '@orpc/json-schema'
import { OpenAPILink } from '@orpc/openapi/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { ZodToJsonSchemaConverter } from '@orpc/zod'
import { type Contract, contract } from '@repo/contract'

const link = new OpenAPILink(contract, {
	url: '/api',
	plugins: [
		new SmartCoercionLinkPlugin(contract, {
			converters: [new ZodToJsonSchemaConverter()],
		}),
	],
})

export const client: RouterContractClient<Contract> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)

export type ApiInputs = InferContractRouterInputs<Contract>
export type ApiOutputs = InferRouterContractOutputs<Contract>
