import {create} from 'zustand';
import type {HistoryEntry, InteractionType} from '../components/History/history.ts';
import {clearHistoryEntries, getAllHistoryEntries, getHistoryEntry, putHistoryEntry} from '../lib/historyDb.ts';
import {useStoryStore} from './storyStore.ts';

type HistoryState = {
	// Persisted journeys, chronological (oldest first) — see historyDb.
	entries: HistoryEntry[];
	// Latest session title from the discoveryFeed block, applied to the journey.
	currentTitle: string;
	/** Re-read every entry from IndexedDB into memory. */
	loadHistory: () => Promise<void>;
	/** Set the session title; updates the current journey if it already exists. */
	setTitle: (title: string) => Promise<void>;
	/** Append an interaction to the current journey, creating it on the first one. */
	addInteraction: (interaction: InteractionType) => Promise<void>;
	/** Backfill the server-minted chapter id onto the interaction that produced it. */
	attachChapterId: (chapterId: string) => void;
	/** Wipe every stored journey. */
	clearHistory: () => Promise<void>;
};

// The journey is keyed by the active session's story id (see storyStore): with
// storyId threaded back into every round, one story spans the whole session, so
// its id is a stable key for the expedition all interactions accrue to.
const currentStoryId = () => useStoryStore.getState().currentStoryId;

// Read/write hook for the visitor's history, backed by IndexedDB so writes from
// the conversation layer and reads from the UI stay in sync across the app.
export const useHistoryStore = create<HistoryState>((set, get) => ({
	entries: [],
	currentTitle: '',

	loadHistory: async () => {
		set({entries: await getAllHistoryEntries()});
	},

	setTitle: async title => {
		set({currentTitle: title});
		// The journey is created lazily on the first interaction; only rename it
		// once it exists (a title alone must never persist an empty journey).
		const id = currentStoryId();
		if (!id || !title) return;
		const entry = await getHistoryEntry(id);
		if (!entry || entry.title === title) return;
		await putHistoryEntry({...entry, title, date: new Date().toISOString()});
		await get().loadHistory();
	},

	addInteraction: async interaction => {
		const id = currentStoryId();
		if (!id) return;
		const entries = get().entries;
		const existing = entries.find(e => e.id === id);
		// Create lazily on the first interaction so we never persist an empty
		// journey; title comes from the discoveryFeed, falling back to the label.
		const entry: HistoryEntry = existing
			? {...existing, interactions: [...existing.interactions, interaction], date: new Date().toISOString()}
			: {id, title: get().currentTitle || interaction.label, date: new Date().toISOString(), interactions: [interaction]};
		// Reflect in memory synchronously so a fast chapter event can immediately
		// backfill this interaction's chapter id (attachChapterId reads `entries`).
		set({entries: existing ? entries.map(e => (e.id === id ? entry : e)) : [...entries, entry]});
		await putHistoryEntry(entry);
	},

	// Interactions are recorded optimistically with a random id before the round
	// is sent; the chapter id only comes back with the chapter event. Assign it to
	// the oldest interaction still missing one — interactions and rounds are 1:1 in
	// order, so first-unassigned is the round that just landed. Idempotent (a
	// chapter streams several events), and applied to the in-memory entries
	// synchronously so back-to-back rounds don't race the IndexedDB write.
	attachChapterId: chapterId => {
		const storyId = currentStoryId();
		if (!storyId) return;
		const entries = get().entries;
		const entry = entries.find(e => e.id === storyId);
		if (!entry || entry.interactions.some(i => i.chapterId === chapterId)) return;
		const target = entry.interactions.findIndex(i => !i.chapterId);
		if (target === -1) return;
		const updated: HistoryEntry = {
			...entry,
			interactions: entry.interactions.map((interaction, index) =>
				index === target ? {...interaction, chapterId} : interaction),
		};
		set({entries: entries.map(e => (e.id === storyId ? updated : e))});
		void putHistoryEntry(updated);
	},

	clearHistory: async () => {
		await clearHistoryEntries();
		set({entries: []});
	},
}));

// Hydrate once at module load so consumers get persisted entries without each
// having to trigger a read on mount.
void useHistoryStore.getState().loadHistory();
