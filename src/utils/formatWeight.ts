/**
 * Formats a weight given in grams into the most readable unit (g, kg, or t).
 */
export function formatWeight(grams: number): string {
	if (grams >= 1_000_000) {
		return `${trim(grams / 1_000_000)} t`;
	}
	if (grams >= 1_000) {
		return `${trim(grams / 1_000)} kg`;
	}
	return `${trim(grams)} g`;
}

/** Drops trailing zeros, keeping at most 2 decimal places. */
function trim(value: number): string {
	return Number(value.toFixed(2)).toString();
}
