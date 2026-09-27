import type { InferContractRouterInputs, InferRouterContractOutputs } from '@orpc/contract'
import type { Contract } from '@repo/contract'

export type ApiInputs = InferContractRouterInputs<Contract>
export type ApiOutputs = InferRouterContractOutputs<Contract>
