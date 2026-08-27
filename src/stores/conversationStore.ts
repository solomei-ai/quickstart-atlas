import {create} from 'zustand';
import type {Chapter} from '@solomei-ai/thamyr-react';

type ConversationState = {
	// Chapters (rounds) of the active story, in arrival order. Held in a store so
	// switching conversations from the history map can reset them from a click
	// handler while useThamyrConversation keeps merging streamed CHAPTER_EVENTs.
	chapters: Chapter[];
	updateChapters: (updater: (prev: Chapter[]) => Chapter[]) => void;

	// A switch to a past journey is in flight. Set true (atomically with clearing
	// chapters, so the scroll effect can never fire against the outgoing story)
	// until useSwitchScroll has scrolled to the target round and revealed the page.
	isSwitchPending: boolean;
	// The round to scroll to once the switched-in story renders — the real Thamyr
	// chapter id of the tapped node. Null when the tapped node has no chapter id
	// yet (e.g. a journey recorded before chapter ids were tracked): just reload.
	switchTargetChapterId: string | null;
	// Begin a switch: drop the current chapters and arm the scroll target.
	beginSwitch: (chapterId: string | null) => void;
	// Arm the scroll target for a round already present in the current story (e.g.
	// the timeline marker jumping within the active session). Same effect as a
	// switch minus the reload — chapters are kept, so useSwitchScroll's effect runs and
	// useLoaderScroll suppresses its pre-scroll — so the loader-hidden jump lands
	// on the target instead of the pre-scroll's bottom-of-page position.
	scrollToLoadedRound: (chapterId: string) => void;
	// End a switch once useSwitchScroll has handled the scroll + loader.
	endSwitch: () => void;
};

export const useConversationStore = create<ConversationState>(set => ({
	chapters: [],
	updateChapters: updater => set(state => ({chapters: updater(state.chapters)})),

	isSwitchPending: false,
	switchTargetChapterId: null,
	beginSwitch: chapterId => set({chapters: [], isSwitchPending: true, switchTargetChapterId: chapterId}),
	scrollToLoadedRound: chapterId => set({isSwitchPending: true, switchTargetChapterId: chapterId}),
	endSwitch: () => set({isSwitchPending: false, switchTargetChapterId: null}),
}));
