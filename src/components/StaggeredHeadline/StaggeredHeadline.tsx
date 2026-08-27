import styles from './StaggeredHeadline.module.scss';
import AnimatedText from '../TextResponse/AnimatedText';
import {AnimatePresence} from "motion/react";

// Each line is aligned to a different edge, cycling start → center → end.
const alignment = ['start', 'center', 'end'] as const;

type StaggeredHeadlineProps = {
	// Newline-separated text. Each line renders as its own <h1>, aligned to a
	// different edge based on its position.
	readonly text: string;
	readonly className?: string;
	readonly isVisible?: boolean;
};

function StaggeredHeadline({text, className, isVisible}: StaggeredHeadlineProps) {
	const lines = text.split('\n');

	return (
		<div
			className={`${styles.headline} ${className ?? ''}`}
		>
			<AnimatePresence>
				{isVisible && lines.map((lineText, index) => (
					<AnimatedText delay={(650 * index) + 700} className={`${styles.line} ${styles[alignment[index % alignment.length]]}`} key={index}>
						{lineText}
					</AnimatedText>
				))}
			</AnimatePresence>
		</div>
	);
}

export default StaggeredHeadline;
