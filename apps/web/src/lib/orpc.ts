import { createORPCClient } from '@orpc/client'
import type { RouterContractClient } from '@orpc/contract'
import { OpenAPILink } from '@orpc/openapi/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { type Contract, contract } from '@repo/contract'

const link = new OpenAPILink(contract, {
	url: '/api',
})

export const client: RouterContractClient<Contract> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
