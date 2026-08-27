import {motion} from 'motion/react';

import styles from './WorldMap.module.scss';
import type {Animal} from '../../types/animals.ts';
import AnimalIcon from '../AnimalIcon/AnimalIcon.tsx';
import {T} from '../../lib/easings.ts';

const ICON_SIZE = 12;

type AnimalMarkerProps = {
	readonly animal: Animal;
	/** Pixel position of the marker within the map track. */
	readonly x: number;
	readonly y: number;
	/** Whether this marker's card is currently open. */
	readonly isOpen: boolean;
	readonly reduceMotion: boolean;
	/** Seconds to delay the entrance, used to stagger a batch of new markers. */
	readonly enterDelay?: number;
	readonly onHoverStart: () => void;
	readonly onHoverEnd: () => void;
	readonly onToggle: () => void;
};

/**
 * A single animal icon plotted on the {@link WorldMap}. Scales itself in on
 * mount (delayed by `enterDelay` so a batch cascades) and out on removal via
 * the wrapping `AnimatePresence`, then scales up on hover/focus. Clicking
 * toggles the animal's card open.
 */
function AnimalMarker({
	animal,
	x,
	y,
	isOpen,
	reduceMotion,
	enterDelay = 0,
	onHoverStart,
	onHoverEnd,
	onToggle,
}: AnimalMarkerProps) {
	const markerVariants = {
		hidden: {scale: reduceMotion ? 1 : 0},
		// Delay lives on the entrance only, so exit (falling back to the
		// component `transition`) isn't held back when the marker is removed.
		visible: {scale: 1, transition: {...T.spring, delay: enterDelay}},
	};

	return (
		<motion.div
			className={styles.markerSlot}
			style={{left: x, top: y}}
			variants={markerVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
			transition={T.spring}
		>
			<motion.button
				type="button"
				className={styles.marker}
				aria-label={animal.name}
				aria-expanded={isOpen}
				onPointerEnter={onHoverStart}
				onPointerLeave={onHoverEnd}
				onFocus={onHoverStart}
				onBlur={onHoverEnd}
				onClick={onToggle}
				whileHover={reduceMotion ? undefined : {scale: 1.25}}
				whileFocus={reduceMotion ? undefined : {scale: 1.25}}
				transition={T.fast}
			>
				<AnimalIcon
					classification={animal.type}
					status={animal.status}
					animalHabitat={animal.habitats[0]}
					size={ICON_SIZE}
				/>
			</motion.button>
		</motion.div>
	);
}

export default AnimalMarker;
