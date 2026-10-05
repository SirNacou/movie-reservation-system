import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

type ErrorRecord = Record<string, unknown>

function isErrorRecord(value: unknown): value is ErrorRecord {
	return typeof value === 'object' && value !== null
}

function getErrorDetails(response: unknown, status: number) {
	const record = isErrorRecord(response) ? response : undefined
	const nestedError = isErrorRecord(record?.error) ? record.error : undefined
	const messageValue = nestedError?.message ?? record?.message ?? response
	const message = Array.isArray(messageValue)
		? messageValue.map(String).join('; ')
		: typeof messageValue === 'string'
			? messageValue
			: (HttpStatus[status] ?? 'Request failed')

	const details = nestedError?.details ?? nestedError?.data ?? record?.details ?? record?.data

	return {
		code:
			typeof nestedError?.code === 'string'
				? nestedError.code
				: typeof record?.code === 'string'
					? record.code
					: (HttpStatus[status] ?? 'UNKNOWN_ERROR'),
		message,
		...(details === undefined ? {} : { details }),
	}
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name)
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: unknown, host: ArgumentsHost) {
		const { httpAdapter } = this.httpAdapterHost
		const ctx = host.switchToHttp()

		const isHttpException = exception instanceof HttpException
		const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
		const errorResponse = isHttpException ? exception.getResponse() : 'Internal server error'

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
			error: getErrorDetails(errorResponse, httpStatus),
		}

		if (httpStatus !== HttpStatus.INTERNAL_SERVER_ERROR) {
			this.logger.error(
				`Unhandled exception on ${httpAdapter.getRequestMethod(ctx.getRequest())} ${httpAdapter.getRequestUrl(ctx.getRequest())}`,
				exception instanceof Error ? exception.stack : null,
			)
		}

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
	}
}
