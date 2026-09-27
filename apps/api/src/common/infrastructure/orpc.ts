import { InferContractRouterInputs, InferRouterContractOutputs } from '@orpc/contract'
import { Contract } from '@repo/contract'

export type ApiInputs = InferContractRouterInputs<Contract>
export type ApiOutputs = InferRouterContractOutputs<Contract>
