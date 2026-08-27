import styles from './Loader.module.scss';
import {useEffect, useState} from 'react';
import {loadingPhrases} from './loading.ts';
import AnimatedText from "../TextResponse/AnimatedText.tsx";
import PaperBackground from '../../assets/assets/storybook-bg.png';
import ClothWipe from "../ClothWipe/ClothWipe.tsx";
import PawTrail from './PawTrail.tsx';
import {AnimatePresence} from "motion/react";

type LoaderProps = {
	readonly intervalMs?: number;
	readonly isPlain?: boolean;
};

function Loader({intervalMs = 3000, isPlain}: LoaderProps) {
	const [index, setIndex] = useState(() => Math.floor(Math.random() * loadingPhrases.length));

	useEffect(() => {
		const id = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
			setIndex(randomIndex);
		}, intervalMs);
		return () => clearInterval(id);
	}, [intervalMs]);

	return (
		<ClothWipe src={PaperBackground} style={{position: "fixed", inset: 0, zIndex: 90}}>
			{
				isPlain ? null : (
					<>
					<PawTrail pawHeight={150}/>
					<div className={styles.container}>
						<AnimatePresence mode={'popLayout'}>
							<AnimatedText className={styles.loadingPhrase}>{`${loadingPhrases[index]}...`}</AnimatedText>
						</AnimatePresence>
					</div>
					</>
				)
			}
		</ClothWipe>
	);
}

export default Loader;
