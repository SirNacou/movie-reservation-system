export const formatDateTime = (value: Date) => {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(value))
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date)
}

export function formatTime(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
	}).format(date)
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
