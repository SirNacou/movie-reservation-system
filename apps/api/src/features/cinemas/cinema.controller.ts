import { Controller } from '@nestjs/common'
import { Implement } from '@orpc/nest'
import { implement, ORPCError } from '@orpc/server'
import { R } from '@praha/byethrow'
import { contract } from '@repo/contract'
import { CreateCinemaHandler } from './create-cinema/create-cinema.handler.js'
import { ListCinemasHandler } from './list-cinemas/list-cinemas.handler.js'
import { RemoveCinemaHandler } from './remove-cinema/remove-cinema.handler.js'

@Controller()
export class CinemasController {
	constructor(
		private readonly createCinemaHandler: CreateCinemaHandler,
		private readonly removeCinemaHandler: RemoveCinemaHandler,
		private readonly listCinemasHandler: ListCinemasHandler,
	) {}

	@Implement(contract.cinemas)
	cinemas() {
		return {
			list: implement(contract.cinemas.list).handler(() => this.listCinemasHandler.handle()),
			create: implement(contract.cinemas.create).handler(async ({ input }) => {
				const res = await this.createCinemaHandler.handle({ req: input })
				if (R.isFailure(res)) {
					const error = res.error.at(0)
					if (!error) throw new ORPCError('BAD_GATEWAY')
					throw new ORPCError('BAD_REQUEST', error)
				}

				return res.value
			}),
			delete: implement(contract.cinemas.delete).handler(async ({ input: { id } }) => {
				const res = await this.removeCinemaHandler.handle({ id })
				if (R.isFailure(res)) {
					throw new ORPCError('BAD_REQUEST', {
						cause: res.error.cause,
						message: res.error.message,
					})
				}

				return
			}),
		}
	}
}
