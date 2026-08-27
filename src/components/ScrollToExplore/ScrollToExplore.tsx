import styles from './ScrollToExplore.module.scss';
import {useTranslation} from "../../i18n/useTranslation.ts";
import {motion, useScroll, useMotionValueEvent, AnimatePresence, type Variants} from "motion/react";
import {useState} from "react";
import {EASE_OUT_EXPO} from "../../lib/easings";
import {useMapAnimalsStore} from "../../stores/mapAnimalsStore.ts";

const variants: Variants = {
	hidden: {opacity: 0, y: 8},
	visible: {opacity: 1, y: 0},
};

type ScrollToExploreProps = {
	// Gates the hint so it only shows once the intro animation has ended.
	readonly isVisible?: boolean;
};

function ScrollToExplore({isVisible = true}: ScrollToExploreProps) {
	const {t} = useTranslation();
	const {scrollY} = useScroll();
	const {mapAnimals} = useMapAnimalsStore();

	// Mirror the scroll position into state. Reading scrollY.get() in render
	// doesn't subscribe to changes, so the component never reacts to scrolling;
	// useMotionValueEvent re-renders us whenever scrollY actually changes.
	const [atTop, setAtTop] = useState(() => scrollY.get() <= 0);
	useMotionValueEvent(scrollY, 'change', (latest) => {
		setAtTop(latest <= 30);
	});

	if(!isVisible || mapAnimals.length === 0) {
		return null;
	}

	return (
		<AnimatePresence>
			{atTop && (
				<motion.div
					className={styles.container}
					variants={variants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					transition={{duration: 0.5, ease: EASE_OUT_EXPO}}
				>
					{t("interact_to_explore")}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ScrollToExplore;
