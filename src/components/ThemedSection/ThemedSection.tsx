import styles from './ThemedSection.module.scss';
import type {Animal} from "../../types/animals.ts";
import type {Fact} from "../../thamyr/blockData.ts";
import AnimalEntry from "../AnimalEntry/AnimalEntry.tsx";
import FactSection from "../FactSection/FactSection.tsx";
import Markdown from "react-markdown";
import CoralReef from "../../assets/assets/coral-reef.png";
import Desert from "../../assets/assets/desert.png";
import Forest from "../../assets/assets/forest.png";
import Mountain from "../../assets/assets/mountain.png";
import Rainforest from "../../assets/assets/rainforest.png";
import River from "../../assets/assets/river.png";
import Savanna from "../../assets/assets/savanna.png";
import Tundra from "../../assets/assets/tundra.png";

/** One animal in the section: its profile plus the LLM-generated caption (may be absent if generation failed). */
export type ThemedAnimal = {
	readonly animal: Animal;
	readonly fact?: Fact;
};

type ThemedSectionProps = {
	readonly animals: readonly ThemedAnimal[];
	readonly title: string;
	readonly description: string;
	readonly theme: string;
};

// Themes whose habitat art sits overhead (a canopy, a cave ceiling) render their background at the
// top of the section; every other theme renders it at the bottom, as a horizon.
const TOP_BACKGROUND_THEMES = new Set(['Rainforest']);

// Keyed by habitat, and the keys must match the `habitat` enum in the block's
// `theme` item exactly — a key that misses (`Coral reef` for `Coral Reef`)
// silently drops the background rather than failing. These are the eight
// habitats this project loads; the reference project covers twenty.
const THEME_BACKGROUND_IMAGES: Record<string, string> = {
	'Coral Reef': CoralReef,
	Desert,
	Forest,
	Mountain,
	Rainforest,
	River,
	Savanna,
	Tundra,
};

function ThemedSection({animals, theme, description, title}: ThemedSectionProps) {
	// A theme whose art has not landed yet renders the section on the gradient
	// alone rather than an element with no image in it.
	const backgroundImage = THEME_BACKGROUND_IMAGES[theme] as string | undefined;
	const isTopBackground = TOP_BACKGROUND_THEMES.has(theme);

	return (
		<div data-theme={theme} className={styles.container}>
			{backgroundImage && isTopBackground && (
				<div className={styles['background-top']} style={{backgroundImage: `url(${backgroundImage})`}}/>
			)}
			<div data-theme={'light'} className={styles.header}>
				<h2>
					<Markdown components={{p: ({children}) => <>{children}</>}}>{title}</Markdown>
				</h2>
				<p>{description}</p>
			</div>
			{
				animals.map(({animal, fact}, index) => {
					// `fact` is the generated caption and is allowed to be absent. Keep the
					// animal either way: dropping the section would also drop its
					// AnimalEntry, and with it the only way to open that animal.
					return (
						<div key={`${animal.slug}-${index}`} className={styles.animalSection}>
							{fact && (
								<div data-theme={'light'} className={styles.textContainer}>
									<div className={styles.cardContainer}>
										<FactSection title={fact.title} description={fact.text}/>
									</div>
								</div>
							)}
							<div className={styles.animalContainer}>
								<AnimalEntry name={animal.name} imageUrl={animal.imageUrl} size={'xl'} theme={'light'}/>
							</div>
						</div>
					)
				})
			}
			{backgroundImage && (
				isTopBackground
					? <div className={styles.placeholder}/>
					: <div className={styles['background-bottom']} style={{backgroundImage: `url(${backgroundImage})`}}/>
			)}
		</div>
	)
}

export default ThemedSection;
