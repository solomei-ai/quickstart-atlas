import styles from './ThemedSection.module.scss';
import type {Animal} from "../../types/animals.ts";
import type {Fact} from "../../thamyr/blockData.ts";
import AnimalEntry from "../AnimalEntry/AnimalEntry.tsx";
import FactSection from "../FactSection/FactSection.tsx";
import Markdown from "react-markdown";
import ScatterField from "../ScatterField/ScatterField.tsx";
import type {ThemeAsset} from "../../assets/themeAssets/themeAsset.ts";
import {coralReefAssets} from "../../assets/themeAssets/coralreef/coralreefAssets.ts";
import {desertAssets} from "../../assets/themeAssets/desert/desertAssets.ts";
import {forestAssets} from "../../assets/themeAssets/forest/forestAssets.ts";
import {mountainAssets} from "../../assets/themeAssets/mountain/mountainAssets.ts";
import {rainForestAssets} from "../../assets/themeAssets/rainforest/rainforestAssets.ts";
import {riverAssets} from "../../assets/themeAssets/river/riverAssets.ts";
import {savannaAssets} from "../../assets/themeAssets/savanna/savannaAssets.ts";
import {tundraAssets} from "../../assets/themeAssets/tundra/tundraAssets.ts";

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


// Keyed by habitat, and the keys must match the `habitat` enum in the block's
// `theme` item exactly — a key that misses (`Coral reef` for `Coral Reef`)
// silently drops the scatter field rather than failing. These are the eight
// habitats this project loads; the reference project covers twenty.
const SCATTER_ASSETS: Record<string, ThemeAsset> = {
	'Coral Reef': coralReefAssets,
	Desert: desertAssets,
	Forest: forestAssets,
	Mountain: mountainAssets,
	Rainforest: rainForestAssets,
	River: riverAssets,
	Savanna: savannaAssets,
	Tundra: tundraAssets,
};

// Every theme bundle exports the same three group keys, so the groups are a
// constant here rather than an import from one particular habitat's bundle.
const SCATTER_GROUPS = [
	{key: 'monstera'},
	{key: 'broadleaf'},
	{key: 'bloom', scale: 0.65},
] as const;

function ThemedSection({animals, theme, description, title}: ThemedSectionProps) {
	// A theme whose art has not landed yet renders the section without a field
	// rather than dealing from an undefined pool.
	const scatterAssets = SCATTER_ASSETS[theme] as ThemeAsset | undefined;

	return (
		<div data-theme={theme} className={styles.container}>
			{scatterAssets && <ScatterField assets={scatterAssets} groups={SCATTER_GROUPS} seed={theme}/>}
			<div data-theme={'light'} className={styles.header}>
				<h4>
					<Markdown components={{p: ({children}) => <>{children}</>}}>{title}</Markdown>
				</h4>
				<p>{description}</p>
			</div>
			{
				animals.map(({animal, fact}, index) => {
					if (!fact) {
						return null
					}
					return (
						<div key={`${animal.slug}-${index}`} className={styles.animalSection}>
							<div data-theme={'light'} className={styles.textContainer}>
								<div className={styles.cardContainer}>
									{fact && <FactSection title={fact.title} description={fact.text}/>}
								</div>
							</div>
							<div className={styles.animalContainer}>
								<AnimalEntry name={animal.name} imageUrl={animal.imageUrl} size={'xl'} theme={'light'}/>
							</div>
						</div>
					)
				})
			}
		</div>
	)
}

export default ThemedSection;
