const MS_PER_DAY = 86_400_000;

/**
 * Formats a date into a human-friendly day label plus a region-aware time,
 * e.g. "today - 11:07 am". Recent dates collapse to "today" / "yesterday"; the
 * clock format follows the locale (12h "11:07 am" vs 24h "23:07").
 */
export function formatHistoryDate(date: Date, locale?: string): string {
	return `${formatDay(date, locale)} - ${formatTime(date, locale)}`;
}

function formatDay(date: Date, locale?: string): string {
	const days = Math.round(
		(startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / MS_PER_DAY,
	);
	if (days === 0) return 'today';
	if (days === 1) return 'yesterday';
	return new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(date);
}

function formatTime(date: Date, locale?: string): string {
	const minutes = String(date.getMinutes()).padStart(2, '0');
	if (usesHour12(locale)) {
		const hours = date.getHours();
		const period = hours >= 12 ? 'pm' : 'am';
		return `${hours % 12 || 12}:${minutes} ${period}`;
	}
	return `${String(date.getHours()).padStart(2, '0')}:${minutes}`;
}

/** Whether the locale (or the runtime default) uses a 12-hour clock. */
function usesHour12(locale?: string): boolean {
	return Boolean(
		new Intl.DateTimeFormat(locale, {hour: 'numeric'}).resolvedOptions().hour12,
	);
}

/** Midnight of the given date, in local time. */
function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
