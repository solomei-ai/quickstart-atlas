import {AnimatePresence, motion} from 'motion/react';
import styles from './Background.module.scss';
import {T} from '../../lib/easings';
import {useBackgroundStore} from '../../stores/backgroundStore';
import mapBg from '../../assets/assets/map-bg.png';
import Canopy from '../../assets/assets/canopy.png';
import Marine from '../../assets/assets/marine.png';

// Registry of overlay images, blended (`multiply`) over the static base layer.
// `none` renders no overlay. Add a key here — and a matching entry in any
// toolbar/control that picks the variant — to introduce a new background.
const OVERLAYS = {
	none: null,
	Canopy,
	map: mapBg,
	Marine
} satisfies Record<string, string | null>;

export type BackgroundVariant = keyof typeof OVERLAYS;

// Full-viewport, fixed background split across two layers: the base (color +
// gradient + texture) sits behind page content (z-index 0), while the variant
// image renders as a root-level sibling above the content (z-index 2) but
// below the prompt bar — it multiply-blends over the sections beneath it.
// The overlay cross-fades whenever the store's `variant` changes — keyed by
// variant so AnimatePresence overlaps the outgoing and incoming layers.
// Set the variant from anywhere via `useBackgroundStore` (`setVariant`).
function Background() {
	const variant = useBackgroundStore(state => state.variant);
	const overlay = OVERLAYS[variant];

	return (
		<>
			<div className={styles.background} aria-hidden="true">
				<div className={styles.base} />
			</div>
			<AnimatePresence>
				{overlay && (
					<motion.div
						key={variant}
						className={styles.overlay}
						style={{backgroundImage: `url(${overlay})`}}
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
						transition={T.slow}
						aria-hidden="true"
					/>
				)}
			</AnimatePresence>
		</>
	);
}

export default Background;
