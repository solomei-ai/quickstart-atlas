import styles from './Home.module.scss';
import LandingHero from "./LandingHero.tsx";
import WorldMap from "../WorldMap/WorldMap.tsx";
import {useMapAnimalsStore} from "../../stores/mapAnimalsStore.ts";
import {useEffect, useState} from "react";
import MapOverlay from "./MapOverlay.tsx";
import ScrollToExplore from "../ScrollToExplore/ScrollToExplore.tsx";
import { motion } from "motion/react";

const ANIMATION_DURATION = 3800;

function Home() {
	const {mapAnimals} = useMapAnimalsStore();
	const [hasAnimationEnded, setHasAnimationEnded] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setHasAnimationEnded(true);
		}, ANIMATION_DURATION)

		return () => clearTimeout(timeoutId);
	},[])


	// Hold back the results until the intro animation has finished, so markers
	// (and the scroll hint) only appear once the hero has played out.
	const visibleAnimals = hasAnimationEnded ? mapAnimals : [];

	return(
		<motion.div
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			transition={{ duration: 0.5 }}
			className={styles.container}>
			<WorldMap animals={visibleAnimals}/>
			<LandingHero isVisible={!(hasAnimationEnded && mapAnimals.length > 0)} />
			<MapOverlay/>
			<ScrollToExplore isVisible={hasAnimationEnded} />
		</motion.div>
	)
};

export default Home;