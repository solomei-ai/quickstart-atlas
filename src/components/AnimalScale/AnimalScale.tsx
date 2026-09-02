import styles from './AnimalScale.module.scss';
import type {Animal} from "../../types/animals.ts";
import useCustomInteraction from "../../hooks/useCustomInteraction.ts";

/** One animal placed on the scale, with its magnitude on the ranked dimension. */
export type RankedAnimal = {
	readonly animal: Animal;
	/** Position on the queried dimension (speed, ferocity, …); higher = more. Drives order and image size. */
	readonly value: number;
	/** Optional human-readable value shown next to the name, e.g. "112 km/h". */
	readonly label?: string;
};

type AnimalScaleProps = {
	readonly title?: string;
	readonly description?: string;
	readonly animals: readonly RankedAnimal[];
	readonly variant?: 'ascending' | 'descending' | 'plain';
}

// Image heights: the top-ranked animal renders at 240px and the lowest at
// 60px; everything in between is interpolated linearly by its value.
const MAX_IMAGE_PX = 300;
const MIN_IMAGE_PX = 110;

function AnimalScale({title, description, animals, variant = 'plain'}: AnimalScaleProps) {

	const {handleClick} = useCustomInteraction({interactionId: 'animalClick', target: 'animals'});

	// 'plain' keeps the caller's order; the other variants sort by value.
	const sortedAnimals = variant === 'plain'
		? animals
		: [...animals].sort((a, b) =>
			variant === 'ascending'
				? a.value - b.value
				: b.value - a.value
		);

	const values = animals.map(entry => entry.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);

	// 0 for the lowest-ranked animal in the list, 1 for the highest. In 'plain'
	// (or when every animal shares one value) everything counts as highest, so
	// heights max out and the scale reads as a flat row.
	function valueRatio(entry: RankedAnimal): number {
		if (variant === 'plain' || maxValue === minValue) return 1;
		return (entry.value - minValue) / (maxValue - minValue);
	}

	function imageHeight(entry: RankedAnimal): number {
		return MIN_IMAGE_PX + valueRatio(entry) * (MAX_IMAGE_PX - MIN_IMAGE_PX);
	}

	return (
		<div className={styles.container}>
			{title && <h3>{title}</h3>}
			{description && <p>{description}</p>}
			<div className={styles.scaleContainer}>
				<div className={styles.namesContainer}>
					{
						sortedAnimals.map((entry, index) => (
							<div key={`${entry.animal.slug}-${index}`} className={styles.entry}>
								<span>
									{index + 1}.{entry.animal.name}
									{entry.label ? ` (${entry.label})` : ''}
									{index < (sortedAnimals.length - 1) ? ' -' : ''}
								</span>
							</div>
						))
					}
				</div>
				<div className={styles.animalsContainer}>
					{
						sortedAnimals.map((entry, index) => (
							<button
								type={"button"}
								onClick={() => {handleClick(entry.animal.name)}}
								aria-label={entry.animal.name}
								key={`${entry.animal.slug}-${index}`}
								className={styles.animalContainer}
								style={{
									height: imageHeight(entry),
								}}
							>
								<span>{index + 1}.</span>
								<img src={entry.animal.imageUrl} alt={entry.animal.name} />
							</button>
						))
					}
				</div>
			</div>
		</div>
	)
}

export default AnimalScale;
