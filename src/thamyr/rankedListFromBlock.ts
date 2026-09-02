import type { RankedAnimal } from '../components/AnimalScale/AnimalScale.tsx';
import { animalFromSkesisHit } from './animalFromSkesis.ts';
import { skesisAnimalHits } from './blockData.ts';

type Variant = 'ascending' | 'descending' | 'plain';

/** The props a `RankedList` block resolves to — the shape `AnimalScale` consumes. */
export type RankedListData = {
	title: string;
	description: string;
	variant: Variant;
	animals: RankedAnimal[];
};

const VARIANTS: readonly Variant[] = ['ascending', 'descending', 'plain'];

/**
 * Map a `RankedList` block's `data` to `AnimalScale` props, or `null` when the
 * ranking is too thin to draw a scale (fewer than two resolvable animals). The block emits:
 *   - `candidates` → `skesis` animal hits (the shortlist the LLM ranked)
 *   - `ranked`     → an `llm` `{title, subtitle, variant, animals: [{id, value, label}]}`;
 *                    each `id` points back into `candidates`, and `value` places the
 *                    animal on the queried dimension (speed, ferocity, …)
 */
export function rankedListFromBlock(data: unknown): RankedListData | null {
	const d = (data ?? {}) as { candidates?: unknown; ranked?: unknown };
	const ranked = (d.ranked ?? {}) as {
		title?: unknown;
		subtitle?: unknown;
		variant?: unknown;
		animals?: unknown;
	};
	if (!Array.isArray(ranked.animals)) {
		return null;
	}

	// Index the retrieved animals by id so the ranking can join back to real
	// records (canonical name + image) — the LLM only returns ids and values.
	const byId = new Map(
		skesisAnimalHits(d.candidates).map((hit) => [hit.id, hit]),
	);

	const animals: RankedAnimal[] = [];
	for (const entry of ranked.animals as Array<{ id?: unknown; value?: unknown; label?: unknown }>) {
		const hit = typeof entry.id === 'string' ? byId.get(entry.id) : undefined;
		if (!hit) continue;
		animals.push({
			animal: animalFromSkesisHit(hit),
			value: typeof entry.value === 'number' ? entry.value : 0,
			label: typeof entry.label === 'string' && entry.label ? entry.label : undefined,
		});
	}

	// A ranking needs at least two animals to read as a scale.
	if (animals.length < 2) {
		return null;
	}

	const variant = VARIANTS.includes(ranked.variant as Variant)
		? (ranked.variant as Variant)
		: 'descending';

	return {
		title: typeof ranked.title === 'string' ? ranked.title : '',
		description: typeof ranked.subtitle === 'string' ? ranked.subtitle : '',
		variant,
		animals,
	};
}
