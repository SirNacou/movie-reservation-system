type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord | undefined {
	return typeof value === 'object' && value !== null ? (value as UnknownRecord) : undefined
}

/** Extracts a useful message from the API error envelope or a regular Error. */
export function getApiErrorMessage(error: unknown): string {
	const errorRecord = asRecord(error)
	const responseData = asRecord(errorRecord?.data)
	const responseBody = asRecord(responseData?.body)
	const responseError = asRecord(responseBody?.error)

	if (typeof responseError?.message === 'string' && responseError.message.trim()) {
		return responseError.message
	}

	if (typeof responseBody?.message === 'string' && responseBody.message.trim()) {
		return responseBody.message
	}

	const message = errorRecord?.message
	if (typeof message === 'string' && message.trim() && message !== errorRecord?.code) {
		return message
	}

	return 'Request failed. Please try again.'
}
