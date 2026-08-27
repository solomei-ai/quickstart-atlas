import styles from './Loader.module.scss';
import {useEffect, useState} from 'react';
import Icon, {getPawIcons, PAW_ANIMALS} from '../Icon/Icon.tsx';
import {AnimatePresence, motion} from "motion/react";

type AnimatedProgressLoaderIconProps = {
	readonly size?: number;
	readonly intervalMs?: number;
};

const randomAnimal = () => PAW_ANIMALS[Math.floor(Math.random() * PAW_ANIMALS.length)];

// Pick a different animal than the current one, so the key always changes and
// the crossfade actually fires each tick.
const nextAnimal = (prev: (typeof PAW_ANIMALS)[number]) => {
	if (PAW_ANIMALS.length < 2) return prev;
	let next = prev;
	while (next === prev) next = randomAnimal();
	return next;
};

const stepTransition = {
	duration: 1.2,
	ease: 'easeInOut',
	repeat: Infinity,
} as const;

const leftPawVariants = {
	animate: {
		y: ['-25%', '25%', '-25%'],
		scale: [0.8, 0.8, 1.15, 1.15, 1.15, 0.8],
		opacity: [0.8, 0.8, 1, 1, 1, 0.9],
		transition: stepTransition,
	},
};

const rightPawVariants = {
	animate: {
		y: ['25%', '-25%', '25%'],
		scale: [1.15, 1.15, 0.8, 0.8, 0.8, 1.10],
		opacity: [1, 1, 0.8, 0.8, 0.8, 0.9],
		transition: stepTransition,
	},
};

function AnimatedProgressLoaderIcon({size = 16, intervalMs = 1000}: AnimatedProgressLoaderIconProps) {
	const [animal, setAnimal] = useState(randomAnimal);

	useEffect(() => {
		const id = setInterval(() => {
			setAnimal(nextAnimal);
		}, intervalMs);
		return () => clearInterval(id);
	}, [intervalMs]);

	const {left, right} = getPawIcons(animal);
	return (
		<div className={styles.iconsContainer}>
			<motion.div variants={leftPawVariants} animate="animate">
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.div
						key={animal}
						initial={{filter: 'blur(2px)', opacity: 0}}
						animate={{filter: 'blur(0px)', opacity: 1}}
						exit={{filter: 'blur(2px)', opacity: 0}}
						transition={{duration: 0.5, ease: 'easeInOut'}}
					>
						<Icon icon={left} size={size} color={'currentColor'}/>
					</motion.div>
				</AnimatePresence>
			</motion.div>
			<motion.div variants={rightPawVariants} animate="animate">
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.div
						key={animal}
						initial={{filter: 'blur(2px)', opacity: 0}}
						animate={{filter: 'blur(0px)', opacity: 1}}
						exit={{filter: 'blur(2px)', opacity: 0}}
						transition={{duration: 0.5, ease: 'easeInOut'}}
					>
						<Icon icon={right} size={size} color={'currentColor'}/>
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</div>
	);
}

export default AnimatedProgressLoaderIcon;
