import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AllExceptionsFilter } from './all-exceptions-filter.js'

afterEach(() => {
	vi.restoreAllMocks()
})

function createFilterHarness() {
	const request = {}
	const response = {}
	const reply = vi.fn()
	const getRequestUrl = vi.fn(() => '/api/reservations')
	const httpAdapter = {
		getRequestUrl,
		getRequestMethod: vi.fn(() => 'POST'),
		reply,
	}
	const httpAdapterHost = { httpAdapter } as unknown as HttpAdapterHost
	const host = {
		switchToHttp: () => ({
			getRequest: () => request,
			getResponse: () => response,
		}),
	} as ArgumentsHost

	return {
		filter: new AllExceptionsFilter(httpAdapterHost),
		host,
		request,
		response,
		reply,
		getRequestUrl,
	}
}

describe('AllExceptionsFilter', () => {
	it('normalizes structured transport errors without importing their transport', () => {
		vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined)
		const { filter, host, request, response, reply, getRequestUrl } = createFilterHarness()
		const exception = new HttpException(
			{
				defined: false,
				code: 'BAD_REQUEST',
				message: 'Cannot reserve seats for a screening that has already started',
			},
			HttpStatus.BAD_REQUEST,
		)

		filter.catch(exception, host)

		expect(reply).toHaveBeenCalledWith(
			response,
			expect.objectContaining({
				statusCode: HttpStatus.BAD_REQUEST,
				path: '/api/reservations',
				error: {
					code: 'BAD_REQUEST',
					message: 'Cannot reserve seats for a screening that has already started',
				},
			}),
			HttpStatus.BAD_REQUEST,
		)
		expect(getRequestUrl).toHaveBeenCalledWith(request)
	})

	it('hides unexpected exception details from the response', () => {
		const { filter, host, response, reply } = createFilterHarness()

		filter.catch(new Error('database credentials leaked'), host)

		expect(reply).toHaveBeenCalledWith(
			response,
			expect.objectContaining({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Internal server error',
				},
			}),
			HttpStatus.INTERNAL_SERVER_ERROR,
		)
	})
})
