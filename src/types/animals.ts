export type AnimalClassification
	= | 'Mammal'
	| 'Bird'
	| 'Reptile'
	| 'Amphibian'
	| 'Fish'
	| 'Crustacean'
| 'Invertebrates'

export type GeologicalEpoch
	= | 'Cambrian'
	| 'Ordovician'
	| 'Silurian'
	| 'Devonian'
	| 'Carboniferous'
	| 'Permian'
	| 'Triassic'
	| 'Jurassic'
	| 'Cretaceous'
	| 'Paleocene'
	| 'Eocene'
	| 'Oligocene'
	| 'Miocene'
	| 'Pliocene'
	| 'Pleistocene'
	| 'Holocene'
	| 'Present';

/**
 * The habitat vocabulary. These 20 values are exactly the distinct
 * `habitats` entries across the 495-record catalog (`src/mocked-data/animals.json`).
 *
 * 19 of them also have a detail record in `habitats.json` (`HabitatInfo.habitat`).
 * `Marine` — used by 124 of 495 animals — does not: it is a chip without a detail
 * card. That asymmetry is known and deliberate for now (plan KTD6), and is why
 * `animal.habitats` is declared a plain `array<string>` chip list rather than a
 * reference to the `habitat` kind; a reference binding would dangle on `Marine`.
 * Fix the data before "upgrading" it to a reference.
 */
export const HABITATS = [
	'Canopy',
	'Arboreal',
	'Forest',
	'Rainforest',
	'Woodland',
	'Grassland',
	'Savanna',
	'Desert',
	'Tundra',
	'Mountain',
	'Cave',
	'Wetland',
	'Freshwater',
	'River',
	'Lake',
	'Coral Reef',
	'Abyss',
	'Coastal',
	'Marine',
	'Urban',
] as const;

export type Habitat = (typeof HABITATS)[number];

/**
 * Rich, displayable detail for a single {@link Habitat} — the data behind a
 * habitat detail card (see the Madagascar Dry Forest reference).
 */

export type HabitatInfo = {
	/** The canonical habitat key this entry describes. */
	habitat: Habitat;

	/** Short category label shown above the title, e.g. "Tropical Dry Forest". */
	category: string;

	/** Display name */
	name: string;

	description: string;

	/** Distinctive feature tags. One lowercase word each, e.g. arboreal, seasonal, deciduous. */
	features: string[];

	/** Climate summary, e.g. "Tropical, 30–33°C". */
	climate: string;

	/** Annual rainfall, e.g. "1,000–1,500 mm/yr". */
	rainfall: string;

	/** Dry / defining low-water season, e.g. "May – November". */
	drySeason: string;

	/** Defining vegetation or structure — the "Canopy" field, e.g. "Baobab, Pachypodium". */
	canopy: string;

	slug: string;

	/** Local path to the habitat illustration, served from public/, e.g. "/habitats/canopy.png". */
	imageUrl: string;
};

export type AnimalSize = {
	/** Centimeters */
	minHeightCm: number;
	/** Centimeters */
	maxHeightCm: number;
};

export type AnimalWeight = {
	/** Grams */
	minWeightG: number;
	/** Grams */
	maxWeightG: number;
};

export type EpochRange = {
	from: GeologicalEpoch;
	to: GeologicalEpoch;
};

export type AnimalStatus = 'living' | 'extinct' | 'endangered';

export type Coordinates = {
	/** Latitude in degrees, -90..90 (north positive). */
	lat: number;
	/** Longitude in degrees, -180..180 (east positive). */
	lng: number;
};

export type Animal = {
	name: string;
	description: string;
	scientificName: string;
	imageUrl: string;

	/** One lowercase word each. E.g. venomous, nocturnal, camouflage, arboreal */
	features: string[];

	status: AnimalStatus;

	type: AnimalClassification;

	/** Geological age range. Extinct animals must not use Present as the end epoch. */
	epoch: EpochRange;

	/** One or more habitats */
	habitats: Habitat[];

	size: AnimalSize;

	weight: AnimalWeight;

	/**
	 * Representative point of the animal's native range (marine species: open-water
	 * point). Optional because it can't be derived from the Callimacus product feed;
	 * the mocked catalogue populates it for every entry.
	 */
	coordinates?: Coordinates;

	slug: string;
};
