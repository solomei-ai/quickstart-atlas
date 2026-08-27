export type HistoryEntry = {
	id: string;
	title: string;
	date: string;
	interactions: InteractionType[]
}

export type InteractionType = {
	id: string;
	interactionType: 'click' | 'search';
	target: InputTarget;
	label: string;
	// The Thamyr chapter (round) this interaction produced, minted server-side and
	// backfilled when the chapter event arrives (see historyStore.attachChapterId).
	// Used to scroll straight to the round when re-opening a journey from history.
	chapterId?: string;
}

export type InputTarget = 'animals' | 'habitat' | 'related' | 'map' | 'tags' | 'search' | 'size' | 'weight' | 'epoch' | 'category';