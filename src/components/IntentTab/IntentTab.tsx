import {useEffect, useRef, useState} from "react";
import styles from './IntentTab.module.scss';
import {AnimatePresence, motion} from "motion/react";
import Logbook from "./Logbook.tsx";
import HistoryMap from "../History/HistoryMap.tsx";
import type {HistoryEntry} from "../History/history.ts";
import {SLInputEventType, UserInteractionType, useThamyr} from "@solomei-ai/thamyr-react";
import {useStoryStore} from "../../stores/storyStore.ts";
import {useConversationStore} from "../../stores/conversationStore.ts";
import {useLoadingStore} from "../../stores/loadingStore.ts";
import {useLenis} from "lenis/react";
import ClothWipe from "../ClothWipe/ClothWipe.tsx";

type IntentTabProps = {
	readonly text: string;
	readonly onClose: () => void;
}

const WIPE_DURATION = 1.1;

function IntentTab({text, onClose}: IntentTabProps) {

	const [selectedStory, setSelectedStory] = useState<HistoryEntry | undefined>(undefined);
	const [wipeKey, setWipeKey] = useState<number | undefined>(undefined);
	const wipeCount = useRef(0);
	const wipeTimers = useRef<number[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const {sendEvent} = useThamyr();
	const setCurrentStoryId = useStoryStore(state => state.setCurrentStoryId);
	const clearCurrentStoryId = useStoryStore(state => state.clearCurrentStoryId);
	const beginSwitch = useConversationStore(state => state.beginSwitch);
	const {setIsLoading} = useLoadingStore();
	const lenis = useLenis();


	function switchToStory(storyId: string, chapterId?: string) {
		setIsLoading(true);
		onClose();
		const timeoutId = setTimeout(() => {
			beginSwitch(chapterId ?? null);
			setCurrentStoryId(storyId);
			sendEvent(UserInteractionType.GET_STORY, {storyId});
		}, 2200)
		return () => clearTimeout(timeoutId)
	}

	function startNewStory() {
		setIsLoading(true);
		onClose();
		setTimeout(() => {
			beginSwitch(null);
			clearCurrentStoryId();
			lenis?.scrollTo(0, {immediate: true, force: true});
			sendEvent(UserInteractionType.CREATE_ROUND, {
				inputEvent: {type: SLInputEventType.customInteraction, data: {interactionId: 'connection'}},
			});
		}, 2200);
	}

	function wipeTo(next: HistoryEntry | undefined) {
		if (wipeKey !== undefined) return;
		wipeCount.current += 1;
		setWipeKey(wipeCount.current);
		wipeTimers.current.push(
			window.setTimeout(() => setSelectedStory(next), WIPE_DURATION * 1000),
			window.setTimeout(() => setWipeKey(undefined), WIPE_DURATION * 1000 + 80),
		);
	}

	// The panel unmounts on close (and mid-wipe, if the user taps outside), so drop
	// any pending swap timers with it.
	useEffect(() => () => wipeTimers.current.forEach(clearTimeout), []);

	// Close on an outside click. The trigger button (in PromptBar) is excluded so
	// clicking it while open toggles cleanly via its own onClick, rather than this
	// pointerdown closing first and the click immediately reopening.
	useEffect(() => {
		const onPointer = (e: PointerEvent) => {
			const target = e.target as HTMLElement;
			if (containerRef.current?.contains(target)) return;
			if (target.closest('[data-intent-trigger]')) return;
			onClose();
		};
		window.addEventListener('pointerdown', onPointer);
		return () => window.removeEventListener('pointerdown', onPointer);
	}, [onClose]);

	const backgroundStyle = selectedStory ? styles.historyMap : styles.logbook;

	return(
		<motion.div
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			exit={{opacity: 0}}
			ref={containerRef} data-lenis-prevent className={`${styles.container} ${backgroundStyle}`}>
			<AnimatePresence>
				{wipeKey !== undefined && (
					<ClothWipe
						paint={'#E8E3DD'}
						key={wipeKey}
						duration={WIPE_DURATION}
						className={styles.wipe}
						// Positioning has to be inline: ClothWipe hardcodes `position: relative`
						// on its root, which no stylesheet rule can override.
						style={{position: 'absolute', inset: 0}}
					/>
				)}
			</AnimatePresence>
			{
				selectedStory !== undefined ? (
					<HistoryMap
						onClick={(chapterId) => switchToStory(selectedStory.id, chapterId)}
						onDismiss={() => wipeTo(undefined)}
						historyEntry={selectedStory}
					/>
				) : (
					<Logbook
						text={text}
						onClose={onClose}
						onSelectStory={wipeTo}
						onNewStory={startNewStory}
					/>
				)
			}
		</motion.div>
	)
}

export default IntentTab;
