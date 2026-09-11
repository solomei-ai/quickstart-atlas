import type { ThemedAnimal } from '../components/ThemedSection/ThemedSection.tsx';
import { animalFromSkesisHit } from './animalFromSkesis.ts';
import { asFact, skesisAnimalHits } from './blockData.ts';

/** The props a `ThemedSection` block resolves to — the shape the component consumes. */
export type ThemedSectionData = {
	title: string;
	description: string;
	theme: string;
	animals: ThemedAnimal[];
};

/**
 * Map a `ThemedSection` block's `data` to the component props, or `null` when it
 * lacks the essentials (a generated header, or any animals). The block emits:
 *   - `theme`   → an `llm` `{title, text, habitat}` header; `habitat` is a theme
 *                 key (e.g. "Marine") that drives the section gradient / name-plate
 *   - `animals` → `skesis` animal hits, each with a fanned-out `copy: {title, text}` caption
 */
export function themedSectionFromBlock(data: unknown): ThemedSectionData | null {
	const d = (data ?? {}) as { theme?: unknown; animals?: unknown };
	const header = asFact(d.theme);
	const animalHits = skesisAnimalHits(d.animals);
	if (!header || animalHits.length === 0) {
		return null;
	}

	// The header LLM also picks the habitat these animals share; that key drives
	// the gradient + name-plate theme. Fall back to the neutral 'light' theme.
	const habitat = (d.theme as { habitat?: unknown }).habitat;
	const theme = typeof habitat === 'string' && habitat ? habitat : 'light';

	return {
		title: header.title,
		description: header.text,
		theme,
		animals: animalHits.map((hit) => ({
			animal: animalFromSkesisHit(hit),
			fact: asFact((hit as { copy?: unknown }).copy),
		})),
	};
}
