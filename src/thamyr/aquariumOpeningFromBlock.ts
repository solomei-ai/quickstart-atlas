/**
 * The props an `aquariumOpening` block resolves to — the shape the banner consumes.
 *
 * All three strings come from the block's single `static` content item, so the
 * announcement's wording lives on the tenant and changes with one `block save`, no
 * redeploy. That is the whole reason this block is static rather than generated:
 * there is one offer, it does not depend on the question, and nobody should pay
 * for an LLM call to restate it.
 */
export type AquariumOpeningData = {
	readonly tag: string;
	readonly title: string;
	readonly text: string;
};

function asString(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

/**
 * Map an `aquariumOpening` block's `data` to the banner props, or `null` when the
 * static item carries no headline. A banner with no line to read is just a
 * coloured strip, so it renders nothing instead.
 *
 * The platform injects a `static` item's whole value at `data.<id>`, so the item
 * with id `announcement` lands at `data.announcement` — one level deeper than the block's own
 * data key suggests. The top level is accepted too, so the renderer does not
 * care whether the block author nested it.
 */
export function aquariumOpeningFromBlock(data: unknown): AquariumOpeningData | null {
	const d = (data ?? {}) as { announcement?: unknown };
	const source = (d.announcement ?? d) as { tag?: unknown; title?: unknown; text?: unknown };

	const title = asString(source.title);
	if (!title) {
		return null;
	}

	return {
		tag: asString(source.tag),
		title,
		text: asString(source.text),
	};
}
