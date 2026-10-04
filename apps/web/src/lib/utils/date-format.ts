export const formatDateTime = (value: Date) => {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(value))
}

export const formatTime = (value: Date) => {
	return new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(value))
}

export const formatDuration = (minutes: number) => {
	const hours = Math.floor(minutes / 60)
	const remainingMinutes = minutes % 60

	if (hours === 0) {
		return `${remainingMinutes}m`
	}

	if (remainingMinutes === 0) {
		return `${hours}h`
	}

	return `${hours}h ${remainingMinutes}m`
}
