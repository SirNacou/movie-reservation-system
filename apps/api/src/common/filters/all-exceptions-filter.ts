import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name)
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const { httpAdapter } = this.httpAdapterHost
		const ctx = host.switchToHttp()

		const isHttpException = exception instanceof HttpException
		const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
		const errorResponse = isHttpException ? exception.getResponse() : 'Internal server error'

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
			error:
				typeof errorResponse === 'object' && errorResponse !== null
					? errorResponse
					: { message: errorResponse },
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
