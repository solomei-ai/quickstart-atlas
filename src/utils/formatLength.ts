/**
 * Formats a length given in centimeters into the most readable unit (cm or m).
 */
export function formatLength(cm: number): string {
	if (cm >= 100) {
		return `${trim(cm / 100)} m`;
	}
	return `${trim(cm)} cm`;
}

/** Drops trailing zeros, keeping at most 2 decimal places. */
function trim(value: number): string {
	return Number(value.toFixed(2)).toString();
}
