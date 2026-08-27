import styles from './Loader.module.scss';
import {useTranslation, type MessageKey} from "../../i18n/useTranslation.ts";
import {AnimatePresence, motion} from "motion/react";
import {useEffect, useState} from "react";
import AnimatedProgressLoaderIcon from "./AnimatedProgressLoaderIcon.tsx";

type ProgressLoaderProps = {
	isFixed?: boolean;
}

const phrases: MessageKey[] = [
	"loading.splashing",
	"loading.rippling",
	"loading.gliding",
	"loading.Darting",
	"loading.bobbing",
	"loading.pattering",
	"loading.scurrying",
	"loading.burrowing",
	"loading.foraging",
	"loading.nesting",
	"loading.rustling",
	"loading.prowling",
	"loading.trotting",
];

const randomPhrase = () => phrases[Math.floor(Math.random() * phrases.length)];

const INTERVAL_MS = 1800;

function ProgressLoader({isFixed = true}: ProgressLoaderProps) {

	const {t} = useTranslation();
	const [currentPhrase, setCurrentPhrase] = useState(randomPhrase);

	useEffect(() => {
		const id = setInterval(() => {
			setCurrentPhrase(randomPhrase());
		}, INTERVAL_MS);
		return () => clearInterval(id);
	}, []);

	const variants = {
		hidden: { opacity: 0 },
		visible: {opacity: 1, transition: { duration: 0.5}},
	}

	const phraseVariants = {
		initial: { opacity: 0, y: 10, filter: 'blur(2px)' },
		animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.3, delay: 0.3 } },
		exit: { opacity: 0, y: -10, filter: 'blur(2px)'},
	}

	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="visible"
			exit="hidden"
			className={`${styles.progressLoaderContainer} ${isFixed ? styles.fixed : ''}`}>
			<AnimatedProgressLoaderIcon size={16} intervalMs={INTERVAL_MS}/>
			<motion.span
				className={styles.phraseWrapper}
			>
				<span aria-hidden className={styles.phraseMeasure}>{t(currentPhrase)}</span>
				<AnimatePresence>
					<motion.span
						variants={phraseVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						key={currentPhrase}
						className={styles.phrase}>{t(currentPhrase)}</motion.span>
				</AnimatePresence>
			</motion.span>
		</motion.div>
	)
}

export default ProgressLoader;
