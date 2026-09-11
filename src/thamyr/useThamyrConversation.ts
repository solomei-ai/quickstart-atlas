import {
	type Block,
	type Chapter,
	ChapterStatus,
	SLInputEventType,
	ThamyrResponseType,
	useOnResponse,
	UserInteractionType,
	useThamyr,
} from '@solomei-ai/thamyr-react';
import {normalizeType} from "./blockData.ts";
import {
	discoveryFeedAnimalsFromBlock,
	discoveryFeedIntentFromBlock,
	discoveryFeedTitleFromBlock
} from "./discoveryFeedFromBlock.ts";
import {useLoadingStore} from "../stores/loadingStore.ts";
import {useMapAnimalsStore} from "../stores/mapAnimalsStore.ts";
import {useHistoryStore} from "../stores/historyStore.ts";
import {useStoryStore} from "../stores/storyStore.ts";
import {useConversationStore} from "../stores/conversationStore.ts";

const isSuggestedQuestions = (block: Block) => normalizeType(block.type) === 'relQuestions';
const isDiscoveryFeed = (block: Block) => normalizeType(block.type) === 'discoveryFeed';

function orderChapterBlocks(chapterBlocks: Block[]) {
	return [...chapterBlocks].sort((a, b) => {
		const aLast = isSuggestedQuestions(a);
		const bLast = isSuggestedQuestions(b);
		if (aLast !== bLast) return aLast ? 1 : -1;
		return (b.priority ?? 0) + (a.priority ?? 0);
	});
}

export function useThamyrConversation() {
	const {sendEvent} = useThamyr();
	const {isLoading, setIsLoading, isTransitioning, setIsGenerating} = useLoadingStore();
	const updateChapters = useConversationStore(state => state.updateChapters);
	const {setMapAnimals, setIntent} = useMapAnimalsStore();
	const setCurrentStoryId = useStoryStore(state => state.setCurrentStoryId);
	const currentStoryId = useStoryStore(state => state.currentStoryId);
	const setTitle = useHistoryStore(state => state.setTitle);
	const addInteraction = useHistoryStore(state => state.addInteraction);
	const attachChapterId = useHistoryStore(state => state.attachChapterId);

	// `discoveryFeed` blocks seed the world map, not the conversation: pump their
	// animals (and the visitor intent) into the map store and keep them out of
	// chapter history. The block also carries the session title. Returns the
	// chapter with its discoveryFeed blocks stripped.
	function stripDiscoveryFeed(chapter: Chapter): Chapter {
		const chapterBlocks = chapter.blocks ?? [];
		for (const block of chapterBlocks) {
			if (isDiscoveryFeed(block)) {
				setMapAnimals(discoveryFeedAnimalsFromBlock(block.data));
				setIntent(discoveryFeedIntentFromBlock(block.data));
				setTitle(discoveryFeedTitleFromBlock(block.data));
			}
		}
		return {...chapter, blocks: chapterBlocks.filter(block => !isDiscoveryFeed(block))};
	}

	useOnResponse((message) => {
		if (message.type === ThamyrResponseType.STORY_CREATED) {
			setCurrentStoryId(message.story.id);
			// A fresh session mints an empty story (chapters stream in later as
			// CHAPTER_EVENTs). GET_STORY, by contrast, returns the whole journey
			// here — hydrate its chapters so a switched-in conversation renders.
			const storyChapters = message.story.chapters ?? [];
			if (storyChapters.length > 0) {
				const conversationChapters = storyChapters.filter(c => !c.deleted).map(stripDiscoveryFeed);
				updateChapters(() => conversationChapters);
			}
			return;
		}

		if (message.type === ThamyrResponseType.CHAPTER_EVENT) {
			// The first event for a genuine round (not the discovery feed) is where
			// we learn its server-minted id — backfill it onto the interaction that
			// produced the round so history can later scroll straight to it.
			const isNewChapter = !useConversationStore.getState().chapters.some(c => c.id === message.chapter.id);
			const isDiscoveryChapter = (message.chapter.blocks ?? []).some(isDiscoveryFeed);
			const {blocks: conversationBlocks} = stripDiscoveryFeed(message.chapter);
			if (isNewChapter && !isDiscoveryChapter) {
				attachChapterId(message.chapter.id);
			}

			updateChapters(prev => {
				const index = prev.findIndex(c => c.id === message.chapter.id);
				if (index === -1) {
					return [...prev, {...message.chapter, blocks: conversationBlocks}];
				}

				const mergedBlocks = [...(prev[index].blocks ?? [])];
				for (const block of conversationBlocks ?? []) {
					const blockIndex = mergedBlocks.findIndex(b => b.id === block.id);
					if (blockIndex !== -1) {
						mergedBlocks[blockIndex] = block;
					} else {
						mergedBlocks.push(block);
					}
				}

				const next = [...prev];
				next[index] = {...message.chapter, blocks: mergedBlocks};
				return next;
			});

			// Hold the loader until the round has more than one block, so a multi-block
			// round reveals itself settled rather than one block at a time. A round
			// cannot be relied on to ever reach two blocks though — the Quickstart's
			// first round is the written answer alone, and a round no block fits ends
			// empty — so `done` is the fallback that always lets the loader go.
			const blockCount = (conversationBlocks ?? []).length;
			if (blockCount > 1 || message.chapter.status === ChapterStatus.done) {
				setIsLoading(false);
			}

			if (message.chapter.status === ChapterStatus.done) {
				setIsGenerating(false);
			}
		}
	});

	function handleSend(text: string) {
		setIsLoading(true);
		setIsGenerating(true);
		addInteraction({id: crypto.randomUUID(), interactionType: 'search', target: 'search', label: text});
		sendEvent(UserInteractionType.CREATE_ROUND, {
			storyId: currentStoryId ?? undefined,
			inputEvent: {type: SLInputEventType.question, data: {value: text}},
		});
	}

	return {isLoading, handleSend, isTransitioning};
}

/**
 * Reads the conversation's chapters from the store and derives what rendering a
 * round needs. Split out from {@link useThamyrConversation} — which registers the
 * response handler and so must run exactly once — so any component can subscribe
 * to the conversation without re-registering it.
 */
export function useConversationChapters() {
	const chapters = useConversationStore(state => state.chapters);

	// Grouped per chapter so the UI can render (and scroll to) one container
	// per round rather than a flat block list.
	const orderedChapters = chapters.map(chapter => ({
		id: chapter.id,
		blocks: orderChapterBlocks(chapter.blocks ?? []),
	}));
	// Each chapter can carry its own suggested-questions block; only the one
	// from the most recent chapter should render.
	const lastSuggestedQuestionsId = chapters.at(-1)?.blocks?.filter(isSuggestedQuestions).at(-1)?.id;

	return {orderedChapters, lastSuggestedQuestionsId};
}
