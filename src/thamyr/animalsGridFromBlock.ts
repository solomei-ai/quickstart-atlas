import { animalFromSkesisHit } from './animalFromSkesis.ts';
import { skesisAnimalHits } from './blockData.ts';
import type { Animal } from '../types/animals.ts';

/** The props an `animalsGrid` block resolves to — the shape `AnimalCardList` consumes. */
export type AnimalsGridData = {
	title: string;
	description: string;
	animals: Animal[];
};

/**
 * Map an `animalsGrid` block's `data` to `AnimalCardList` props, or `null` when
 * no animals resolved. The block emits:
 *   - `header`  → an `llm` `{title, text, traitQuery}`; `traitQuery` only drives
 *                 the `animals` skesis query server-side and isn't rendered.
 *   - `animals` → `skesis` hits for animals sharing the trait `header` identified.
 */
export function animalsGridFromBlock(data: unknown): AnimalsGridData | null {
	const d = (data ?? {}) as { header?: unknown; animals?: unknown };
	const hits = skesisAnimalHits(d.animals);
	if (hits.length === 0) {
		return null;
	}

	const header = (d.header ?? {}) as { title?: unknown; text?: unknown };

	return {
		title: typeof header.title === 'string' ? header.title : '',
		description: typeof header.text === 'string' ? header.text : '',
		animals: hits.map(animalFromSkesisHit),
	};
}
