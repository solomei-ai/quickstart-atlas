import type { SkesisHit } from './animalFromSkesis.ts';

/** Tenant-authored blocks arrive as `custom:<name>`; strip the prefix to map them. */
export function normalizeType(type: string): string {
	return type.startsWith('custom:') ? type.slice('custom:'.length) : type;
}

/** A title/text pair produced by an `llm` JSON content item (curiosity, definition). */
export type Fact = { title: string; text: string };

/**
 * A `skesis` content slot is an array of hits, or an error object (e.g.
 * `{ error: … }` when the content item failed — `minK` not met, etc.). Returns
 * the real hits (any kind), or `[]` for an error/empty slot, so a block whose
 * retrieval failed resolves to no hits and therefore doesn't render.
 *
 * A non-array slot (the error object) yields `[]`; within an array we also drop
 * any entry carrying an `error` key, so a partial failure can't surface as a hit.
 */
export function skesisHits(value: unknown): SkesisHit[] {
	if (!Array.isArray(value)) return [];
	return (value as SkesisHit[]).filter(
		(hit): hit is SkesisHit => hit != null && typeof hit === 'object' && !('error' in hit),
	);
}

/** As {@link skesisHits}, but only the `animal`-kind hits (e.g. for the grid). */
export function skesisAnimalHits(value: unknown): SkesisHit[] {
	return skesisHits(value).filter((hit) => hit.kind === 'animal');
}

/**
 * As {@link skesisHits}, but only the `habitat`-kind hits. The engine ignores a
 * slot's `kinds` filter, so a habitat query can return animals too — filter here.
 */
export function skesisHabitatHits(value: unknown): SkesisHit[] {
	return skesisHits(value).filter((hit) => hit.kind === 'habitat');
}

/** Narrow an `llm` JSON content slot to a `{title, text}` fact, else undefined. */
export function asFact(value: unknown): Fact | undefined {
	if (value && typeof value === 'object' && 'title' in value && 'text' in value) {
		const { title, text } = value as { title?: unknown; text?: unknown };
		if (typeof title === 'string' && typeof text === 'string') {
			return { title, text };
		}
	}
	return undefined;
}

/** Narrow an `llm` JSON array slot (e.g. related questions) to `{title, text}[]`. */
export function asFacts(value: unknown): Fact[] {
	return Array.isArray(value)
		? value.map(asFact).filter((fact): fact is Fact => fact !== undefined)
		: [];
}

/**
 * Read an array out of an `llm` JSON slot. The platform injects such an item's
 * WHOLE parsed object at `data[<id>]`, so an item with id `questions` whose
 * schema is `{questions: [...]}` lands at `data.questions.questions` — one level
 * deeper than the slot name suggests. Accepts either shape so the renderer does
 * not care which the block author chose.
 */
export function listOf(value: unknown, key: string): unknown[] {
	if (Array.isArray(value)) return value;
	if (value !== null && typeof value === 'object') {
		const inner = (value as Record<string, unknown>)[key];
		if (Array.isArray(inner)) return inner;
	}
	return [];
}
