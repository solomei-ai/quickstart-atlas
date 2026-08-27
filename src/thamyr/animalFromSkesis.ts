import type {
	Animal,
	AnimalClassification,
	AnimalSize,
	AnimalStatus,
	AnimalWeight,
	Coordinates,
	EpochRange,
	GeologicalEpoch,
	Habitat,
	HabitatInfo,
} from '../types/animals.ts';

/** One hit in a `skesis` block's `data.<id>` array: the engine result, verbatim. */
export type SkesisHit = {
	id?: string;
	kind?: string;
	tier?: string;
	score?: number;
	fields?: Record<string, unknown>;
};

function asStringArray(value: unknown): string[] {
	return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

/** An object-shaped property's value; `{}` for an absent or malformed one. */
function asRecord(value: unknown): Record<string, unknown> {
	return value != null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function asNumber(value: unknown): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/**
 * `imageUrl` is a plain string: the producer resolves it before ingest and the
 * passthrough binder stores what it was sent, so there is no asset list to
 * unwrap. Guarded rather than `String()`-coerced because this value lands in an
 * `<img src>` / `url()`, where a stray object would stringify to
 * `"[object Object]"` and fetch; `''` is the sentinel the cards already read as
 * "no image".
 */
function asImageUrl(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

/**
 * `"forest canopy"` → `"Forest Canopy"`. Every value of a BOUND controlled
 * vocabulary arrives case-folded: the engine stores an enum member's
 * `canonicalCode` (`raw.trim().toLowerCase()`) and projects that into `fields`,
 * keeping the producer's casing only as the member's `label` — which no read
 * path receives. Restoring the casing is therefore this mapper's job, and it is
 * load-bearing rather than cosmetic wherever a value is used as a KEY.
 */
function titleCase(value: string): string {
	return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * `type` may arrive canonicalised (`"mammal"`) once the property's controlled
 * vocabulary is bound; AnimalIcon keys on `"Mammal"`. Every `AnimalClassification`
 * is single-word, so capitalising the first letter is the whole inverse.
 */
function toClassification(value: unknown): AnimalClassification {
	const s = String(value ?? '');
	return (s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Mammal') as AnimalClassification;
}

/** Declared `object{from,to}`. Required by `Animal`, so a partial hit degrades to blanks. */
function toEpoch(value: unknown): EpochRange {
	const e = asRecord(value);
	return {
		from: String(e['from'] ?? '') as GeologicalEpoch,
		to: String(e['to'] ?? '') as GeologicalEpoch,
	};
}

/** Declared `object{minHeightCm,maxHeightCm}`. */
function toSize(value: unknown): AnimalSize {
	const s = asRecord(value);
	return {minHeightCm: asNumber(s['minHeightCm']), maxHeightCm: asNumber(s['maxHeightCm'])};
}

/** Declared `object{minWeightG,maxWeightG}`. */
function toWeight(value: unknown): AnimalWeight {
	const w = asRecord(value);
	return {minWeightG: asNumber(w['minWeightG']), maxWeightG: asNumber(w['maxWeightG'])};
}

/**
 * Declared `object{lat,lng}`. `Animal.coordinates` is optional and WorldMap skips
 * an animal without one, so an absent or non-numeric point must be `undefined` —
 * never `{lat: 0, lng: 0}`, which would plant a marker in the Gulf of Guinea.
 */
function toCoordinates(value: unknown): Coordinates | undefined {
	const c = asRecord(value);
	const lat = c['lat'];
	const lng = c['lng'];
	if (typeof lat !== 'number' || !Number.isFinite(lat)) return undefined;
	if (typeof lng !== 'number' || !Number.isFinite(lng)) return undefined;
	return {lat, lng};
}

/**
 * Map a skesis `animal` hit's `fields` to the `Animal` shape the cards render.
 *
 * `fields` is keyed by the tenant's **declared property names**, and under
 * property-first identity naming those are the ingest payload's own top-level
 * keys — i.e. the `Animal` keys themselves. So each read below is just its own
 * name; there are no preset/magic names left to fall back to.
 *
 * The coercion is defensive, not decorative: a hit can be partial (a property
 * the tenant hasn't declared or backfilled yet simply doesn't come back), so a
 * missing field yields a blank, not a crash — but never a fabricated value.
 */
export function animalFromSkesisHit(hit: SkesisHit): Animal {
	const f = hit.fields ?? {};
	return {
		name: String(f['name'] ?? ''),
		description: String(f['description'] ?? ''),
		scientificName: String(f['scientificName'] ?? ''),
		imageUrl: asImageUrl(f['imageUrl']),
		features: asStringArray(f['features']),
		status: String(f['status'] ?? 'living') as AnimalStatus,
		type: toClassification(f['type']),
		epoch: toEpoch(f['epoch']),
		// `habitats` is enum-bound, so it arrives lowercase (see titleCase). This is
		// not cosmetic: `habitats[0]` is a THEME KEY — it lands in `data-theme`,
		// which `_themes.scss` matches as `[data-theme='Coral Reef']`. Attribute
		// matching is case-sensitive, so an un-restored `'coral reef'` silently
		// falls back to the default theme instead of failing.
		habitats: asStringArray(f['habitats']).map(titleCase) as Habitat[],
		size: toSize(f['size']),
		weight: toWeight(f['weight']),
		coordinates: toCoordinates(f['coordinates']),
		slug: String(f['slug'] ?? hit.id?.split(':').pop() ?? ''),
	};
}

/**
 * Map a skesis `habitat` hit's `fields` to the `HabitatInfo` shape HabitatCard
 * renders. As with animals, every key is the property's own declared name.
 * `habitat`/`category` are title-cased defensively for the same reason `type` is.
 */
export function habitatFromSkesisHit(hit: SkesisHit): HabitatInfo {
	const f = hit.fields ?? {};
	const category = titleCase(String(f['category'] ?? ''));
	return {
		habitat: titleCase(String(f['habitat'] ?? '')) as Habitat,
		category,
		name: String(f['name'] ?? category),
		description: String(f['description'] ?? ''),
		features: asStringArray(f['features']),
		climate: String(f['climate'] ?? ''),
		rainfall: String(f['rainfall'] ?? ''),
		drySeason: String(f['drySeason'] ?? ''),
		canopy: String(f['canopy'] ?? ''),
		slug: String(f['slug'] ?? hit.id?.split(':').pop() ?? ''),
		imageUrl: asImageUrl(f['imageUrl']),
	};
}
