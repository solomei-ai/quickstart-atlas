import styles from './StatCard.module.scss';
import type {AnimalWeight} from "../../types/animals.ts";
import {formatWeight} from "../../utils/formatWeight.ts";

type WeightBodyProps = {
	readonly animalWeight: AnimalWeight;
}

function WeightBody({animalWeight}: WeightBodyProps) {
	const {minWeightG, maxWeightG} = animalWeight;
	return (
		<div className={styles.rowContainer}>
			{formatWeight(minWeightG)} - {formatWeight(maxWeightG)}
		</div>
	)
}

export default WeightBody;