import { animalFromSkesisHit } from './animalFromSkesis.ts';
import { skesisAnimalHits } from './blockData.ts';
import type { Animal } from '../types/animals.ts';

/**
 * Extract the animals a `discoveryFeed` block carries, for the world map. The
 * block seeds the map rather than rendering in the conversation, so its data is
 * pumped into the map store instead of the chapter history. Mirrors
 * `animalsGrid`: the `animals` slot is `skesis` hits. Returns `[]` when none
 * resolved.
 */
export function discoveryFeedAnimalsFromBlock(data: unknown): Animal[] {
	const d = (data ?? {}) as { animals?: unknown };
	return skesisAnimalHits(d.animals).map(animalFromSkesisHit);
}

/**
 * Extract the `intent` string a `discoveryFeed` block carries — a short
 * description of what the visitor gravitates toward, surfaced in IntentTab.
 * Returns `''` when the slot is missing or not a string.
 */
export function discoveryFeedIntentFromBlock(data: unknown): string {
	const d = (data ?? {}) as { intent?: unknown };
	return typeof d.intent === 'string' ? d.intent : '';
}

/**
 * Extract the `title` a `discoveryFeed` block carries — the session-level label
 * for the visitor's expedition, used as the history journey title. Returns `''`
 * when the slot is missing or not a string.
 */
export function discoveryFeedTitleFromBlock(data: unknown): string {
	const d = (data ?? {}) as { title?: unknown };
	return typeof d.title === 'string' ? d.title : '';
}
