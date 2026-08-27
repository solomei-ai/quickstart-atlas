import {create} from 'zustand';

type StoryState = {
	// The active session's story id, minted by the server on the first round and
	// delivered via STORY_CREATED. Every subsequent CREATE_ROUND threads this back
	// so the server keeps appending chapters to one story instead of minting a new
	// one per interaction — the SDK does not track it for us. Switching to a past
	// journey from the history map also sets this, so new rounds continue it.
	currentStoryId: string | null;
	setCurrentStoryId: (id: string) => void;
	// Drop the active story so the next round is sent without a story id and the
	// server mints a fresh one (starting a new expedition).
	clearCurrentStoryId: () => void;
};

export const useStoryStore = create<StoryState>(set => ({
	currentStoryId: null,
	setCurrentStoryId: id => set({currentStoryId: id}),
	clearCurrentStoryId: () => set({currentStoryId: null}),
}));
