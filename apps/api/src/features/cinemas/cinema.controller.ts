import { Controller } from '@nestjs/common'
import { Implement } from '@orpc/nest'
import { implement, ORPCError } from '@orpc/server'
import { R } from '@praha/byethrow'
import { contract } from '@repo/contract'
import { ConfigureAuditoriumLayoutHandler } from './configure-auditorium-layout/configure-auditorium-layout.handler.js'
import { CreateAuditoriumHandler } from './create-auditorium/create-auditorium.handler.js'
import { CreateCinemaHandler } from './create-cinema/create-cinema.handler.js'
import { GetAuditoriumLayoutHandler } from './get-auditorium-layout/get-auditorium-layout.handler.js'
import { GetCinemaHandler } from './get-cinema/get-cinema.handler.js'
import { ListCinemasHandler } from './list-cinemas/list-cinemas.handler.js'
import { RemoveCinemaHandler } from './remove-cinema/remove-cinema.handler.js'
import { UpdateCinemaHandler } from './update-cinema/update-cinema.handler.js'

@Controller()
export class CinemasController {
	constructor(
		private readonly createCinemaHandler: CreateCinemaHandler,
		private readonly removeCinemaHandler: RemoveCinemaHandler,
		private readonly listCinemasHandler: ListCinemasHandler,
		private readonly getCinemaHandler: GetCinemaHandler,
		private readonly updateCinemaHandler: UpdateCinemaHandler,
		private readonly createAuditoriumHandler: CreateAuditoriumHandler,
		private readonly configureAuditoriumLayoutHandler: ConfigureAuditoriumLayoutHandler,
		private readonly getAuditoriumLayoutHandler: GetAuditoriumLayoutHandler,
	) {}

	@Implement(contract.cinemas)
	cinemas() {
		return {
			get: implement(contract.cinemas.get).handler(async ({ input: { id } }) => {
				const res = await this.getCinemaHandler.handle({ id })
				if (R.isFailure(res)) {
					throw new ORPCError('NOT_FOUND', { message: res.error.message })
				}

				return res.value
			}),
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
			update: implement(contract.cinemas.update).handler(async ({ input }) => {
				const res = await this.updateCinemaHandler.handle({ req: input })
				if (R.isFailure(res)) {
					throw new ORPCError('NOT_FOUND', { message: res.error.message })
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
			createAuditorium: implement(contract.cinemas.createAuditorium).handler(async ({ input }) => {
				const res = await this.createAuditoriumHandler.handle({ req: input })
				if (R.isFailure(res)) {
					throw new ORPCError('BAD_REQUEST', { message: res.error.message })
				}

				return res.value
			}),
			configureLayout: implement(contract.cinemas.configureLayout).handler(async ({ input }) => {
				const res = await this.configureAuditoriumLayoutHandler.handle({ req: input })
				if (R.isFailure(res)) {
					throw new ORPCError('BAD_REQUEST', { message: res.error.message })
				}

				return res.value
			}),
			getLayout: implement(contract.cinemas.getLayout).handler(async ({ input }) => {
				const res = await this.getAuditoriumLayoutHandler.handle({ req: input })
				if (R.isFailure(res)) {
					throw new ORPCError('NOT_FOUND', { message: res.error.message })
				}

				return res.value
			}),
		}
	}
}
