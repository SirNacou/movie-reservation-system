import { InferContractRouterInputs, InferRouterContractOutputs } from '@orpc/contract'
import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod'
import { Contract, contract } from '@repo/contract'

export type ApiInputs = InferContractRouterInputs<Contract>
export type ApiOutputs = InferRouterContractOutputs<Contract>

const generator = new OpenAPIGenerator({
	converters: [new ZodToJsonSchemaConverter()],
})

export const generateOpenApiSpec = () =>
	generator.generate(contract, {
		base: {
			info: {
				title: 'Movie Reservation API',
				version: '1.0.0',
			},
			servers: [{ url: '/api' }],
		},
	})
