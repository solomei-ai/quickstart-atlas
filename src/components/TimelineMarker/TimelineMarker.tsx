import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useMotionValue, useSpring} from 'motion/react';
import styles from './TimelineMarker.module.scss';
import {useHistoryStore} from '../../stores/historyStore.ts';
import {useStoryStore} from '../../stores/storyStore.ts';
import {useConversationStore} from '../../stores/conversationStore.ts';
import {useMousePosition} from '../../hooks/useMousePosition.ts';
import type {InteractionType} from '../History/history.ts';
import MapIcon from "../History/MapIcon.tsx";
import Icon from "../Icon/Icon.tsx";
import {useLoadingStore} from "../../stores/loadingStore.ts";

// Matches useLoaderScroll's PRE_SCROLL_DELAY_MS: the loader fully covers the page
// by this point, so the jump to the target round happens out of sight.
const LOADER_COVER_DELAY_MS = 1800;

const INFLUENCE_Y = 30;
const INFLUENCE_X = 30;
const MIN_SCALE = 0.5;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

type MarkerProps = {
	readonly interaction: InteractionType;
	readonly mouseX: number;
	readonly mouseY: number;
	readonly onClick: () => void;
};

function Marker({interaction, mouseX, mouseY, onClick}: MarkerProps) {
	const ref = useRef<HTMLButtonElement>(null);
	const scaleX = useMotionValue(MIN_SCALE);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const centerY = rect.top + rect.height / 2;
		const proximityY = clamp01(1 - Math.abs(mouseY - centerY) / INFLUENCE_Y);
		const dx = Math.max(rect.left - mouseX, mouseX - rect.right, 0);
		const proximityX = clamp01(1 - dx / INFLUENCE_X);
		scaleX.set(MIN_SCALE + (1 - MIN_SCALE) * proximityY * proximityX);
	}, [mouseX, mouseY, scaleX]);

	return (
		<motion.button
			ref={ref}
			type="button"
			className={styles.markerContainer}
			aria-label={`${interaction.target}: ${interaction.label}`}
			onClick={onClick}
		>
			<motion.div
				style={{scaleX, transformOrigin: '100% 0'}}
				className={styles.marker} />
		</motion.button>
	);
}

function TimelineMarker() {
	const currentStoryId = useStoryStore(state => state.currentStoryId);
	const interactions = useHistoryStore(
		state => state.entries.find(entry => entry.id === currentStoryId)?.interactions,
	);
	const {x: mouseX, y: mouseY} = useMousePosition();

	// A single arrow + flyout follow the pointer down the column. Their Y is driven
	// raw and read through a spring, so they glide toward the cursor with a little
	// lag instead of snapping row-to-row like a per-marker hover swap would. Only
	// the flyout's content changes, tracking the marker nearest the pointer.
	const containerRef = useRef<HTMLDivElement>(null);
	const followY = useMotionValue(0);
	const smoothFollowY = useSpring(followY, {stiffness: 400, damping: 40, mass: 0.6});
	const [isNear, setIsNear] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const {setIsLoading, setIsTransitioning} = useLoadingStore();
	const scrollToLoadedRound = useConversationStore(state => state.scrollToLoadedRound);

	// Track the pointer's Y (so the arrow/flyout follow it) and which marker sits
	// nearest (so the flyout shows its content). Visibility itself is toggled by
	// entering the clickable column — see onMouseEnter/onMouseLeave below.
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		followY.set(mouseY - rect.top);
		const buttons = el.querySelectorAll<HTMLButtonElement>('button');
		let nearest = 0;
		let nearestDist = Infinity;
		buttons.forEach((button, index) => {
			const buttonRect = button.getBoundingClientRect();
			const dist = Math.abs(mouseY - (buttonRect.top + buttonRect.height / 2));
			if (dist < nearestDist) {
				nearestDist = dist;
				nearest = index;
			}
		});
		setActiveIndex(nearest);
	}, [mouseY, followY]);

	const activeInteraction = interactions?.[activeIndex];

	function scrollToRound(chapterId?: string) {
		if (!chapterId) return;
		setIsLoading(true);
		setIsTransitioning(true);
		setTimeout(() => scrollToLoadedRound(chapterId), LOADER_COVER_DELAY_MS);
	}

	return (
		<div
			ref={containerRef}
			className={styles.container}
			onMouseEnter={() => setIsNear(true)}
			onMouseLeave={() => setIsNear(false)}
		>
			<AnimatePresence>
				{isNear ? (
					<motion.div
						style={{y: smoothFollowY}}
						className={styles.arrow}
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
					>
						<Icon icon={'ArrowRight'} />
					</motion.div>
				) : null}
			</AnimatePresence>
			<AnimatePresence>
				{isNear && activeInteraction ? (
					<motion.div
						style={{y: smoothFollowY}}
						className={styles.flyout}
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
					>
						<div className={styles.flyoutCard}>
							<MapIcon interaction={activeInteraction} />
							{activeInteraction.label}
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
			{interactions?.map(interaction => (
				<Marker
					key={interaction.id}
					interaction={interaction}
					mouseX={mouseX}
					mouseY={mouseY}
					onClick={() => scrollToRound(interaction.chapterId)}
				/>
			))}
		</div>
	);
}

export default TimelineMarker;
