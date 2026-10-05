import { Controller } from '@nestjs/common'
import { Implement } from '@orpc/nest'
import { implement, ORPCError } from '@orpc/server'
import { R } from '@praha/byethrow'
import { contract } from '@repo/contract'
import { Reservation } from './domain/reservation.entity.js'
import { CancelReservationHandler } from './handlers/cancel-reservation.handler.js'
import { ConfirmReservationHandler } from './handlers/confirm-reservation.handler.js'
import { CreateReservationHandler } from './handlers/create-reservation.handler.js'
import { GetReservationHandler } from './handlers/get-reservation.handler.js'
import { ListAdminReservationsHandler } from './handlers/list-admin-reservations.handler.js'
import { ListReservationsHandler } from './handlers/list-reservations.handler.js'
import { ListShowtimeSeatsHandler } from './handlers/list-showtime-seats.handler.js'

@Controller()
export class ReservationsController {
	constructor(
		private readonly createReservationHandler: CreateReservationHandler,
		private readonly getReservationHandler: GetReservationHandler,
		private readonly listReservationsHandler: ListReservationsHandler,
		private readonly listAdminReservationsHandler: ListAdminReservationsHandler,
		private readonly listShowtimeSeatsHandler: ListShowtimeSeatsHandler,
		private readonly confirmReservationHandler: ConfirmReservationHandler,
		private readonly cancelReservationHandler: CancelReservationHandler,
	) {}

	@Implement(contract.reservations)
	reservations() {
		return {
			create: implement(contract.reservations.create).handler(async ({ input }) => {
				const res = await this.createReservationHandler.handle(input)
				if (R.isFailure(res)) {
					throw new ORPCError('BAD_REQUEST', { message: res.error.message })
				}

				return toReservationOutput(res.value)
			}),
			get: implement(contract.reservations.get).handler(async ({ input }) => {
				const res = await this.getReservationHandler.handle(input)
				if (R.isFailure(res)) {
					throw new ORPCError('NOT_FOUND', { message: res.error.message })
				}

				return res.value
			}),
			list: implement(contract.reservations.list).handler(async ({ input }) => {
				const res = await this.listReservationsHandler.handle(input)

				if (R.isFailure(res)) {
					throw res.error
				}

				return res.value.map(toReservationListOutput)
			}),
			listShowtimeSeats: implement(contract.reservations.listShowtimeSeats).handler(
				async ({ input }) => {
					const res = await this.listShowtimeSeatsHandler.handle(input)

					if (R.isFailure(res)) {
						throw new ORPCError('BAD_REQUEST', { message: res.error.message })
					}

					return res.value
				},
			),
			confirm: implement(contract.reservations.confirm).handler(async ({ input }) => {
				const res = await this.confirmReservationHandler.handle(input)

				if (R.isFailure(res)) {
					throw res.error
				}

				return toReservationOutput(res.value)
			}),

			cancel: implement(contract.reservations.cancel).handler(async ({ input }) => {
				const res = await this.cancelReservationHandler.handle(input)

				if (R.isFailure(res)) {
					throw res.error
				}

				return toReservationOutput(res.value)
			}),
			adminList: implement(contract.reservations.adminList).handler(async ({ input }) => {
				const res = await this.listAdminReservationsHandler.handle(input)

				if (R.isFailure(res)) {
					throw res.error
				}

				return res.value.map(toAdminReservationOutput)
			}),
		}
	}
}

function toReservationOutput(reservation: Reservation) {
	return {
		id: reservation.id,
		showtimeId: reservation.showtime.id,
		customerEmail: reservation.customerEmail,
		customerName: reservation.customerName ?? null,
		status: reservation.status,
		expiresAt: reservation.expiresAt,
		seats: reservation.seats.getItems().map((reservationSeat) => ({
			id: reservationSeat.id,
			seatId: reservationSeat.seat.id,
			row: reservationSeat.seat.row,
			number: reservationSeat.seat.number,
		})),
		createdAt: reservation.createdAt,
		updatedAt: reservation.updatedAt,
	}
}

function toReservationListOutput(reservation: Reservation) {
	return {
		id: reservation.id,
		showtimeId: reservation.showtime.id,
		movieTitle: reservation.showtime.movie.title,
		cinemaName: reservation.showtime.auditorium.cinema.name,
		auditoriumName: reservation.showtime.auditorium.name,
		startTime: reservation.showtime.startTime,
		endTime: reservation.showtime.endTime,
		customerEmail: reservation.customerEmail,
		customerName: reservation.customerName ?? null,
		status: reservation.status,
		expiresAt: reservation.expiresAt,
		seats: reservation.seats.getItems().map((reservationSeat) => ({
			id: reservationSeat.id,
			seatId: reservationSeat.seat.id,
			row: reservationSeat.seat.row,
			number: reservationSeat.seat.number,
		})),
		createdAt: reservation.createdAt,
		updatedAt: reservation.updatedAt,
	}
}

function toAdminReservationOutput(reservation: Reservation) {
	return {
		id: reservation.id,
		showtimeId: reservation.showtime.id,
		movieTitle: reservation.showtime.movie.title,
		cinemaName: reservation.showtime.auditorium.cinema.name,
		auditoriumName: reservation.showtime.auditorium.name,
		startTime: reservation.showtime.startTime,
		endTime: reservation.showtime.endTime,
		customerEmail: reservation.customerEmail,
		customerName: reservation.customerName ?? null,
		status: reservation.status,
		expiresAt: reservation.expiresAt,
		seats: reservation.seats.getItems().map((reservationSeat) => ({
			id: reservationSeat.id,
			seatId: reservationSeat.seat.id,
			row: reservationSeat.seat.row,
			number: reservationSeat.seat.number,
		})),
		createdAt: reservation.createdAt,
		updatedAt: reservation.updatedAt,
	}
}
