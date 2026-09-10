import styles from './AnimalComparison.module.scss';
import type {ReactNode} from 'react';
import type {Animal} from '../../types/animals.ts';
import AnimalCard from '../AnimalCard/AnimalCard.tsx';
import StatCard from '../StatCard/StatCard.tsx';
import EpochBody from '../StatCard/EpochBody.tsx';
import HabitatBody from '../StatCard/HabitatBody.tsx';
import SizeBody from '../StatCard/SizeBody.tsx';
import WeightBody from '../StatCard/WeightBody.tsx';

type AnimalComparisonProps = {
	readonly first: Animal;
	readonly second: Animal;
	/** The generated title for the round. Absent if the generation failed. */
	readonly title?: string;
}
type OwnedStatProps = {
	readonly animal: Animal;
	readonly title: string;
	readonly content: ReactNode;
}

// A StatCard labelled with its animal's name — the label only shows on
// mobile, where stacking loses the "left card = first animal" pairing.
function OwnedStat({animal, title, content}: OwnedStatProps) {
	return (
		<div className={styles.stat}>
			<span className={styles.owner}>{animal.name}</span>
			<StatCard title={title} action={() => {}} content={content}/>
		</div>
	);
}

function AnimalComparison({first, second, title}: AnimalComparisonProps) {
	return (
		<div className={styles.container}>
			{title && <h2 className={styles.title}>{title}</h2>}
			<div className={`${styles.inline} ${styles.cards}`}>
				<AnimalCard animal={first}/>
				<AnimalCard animal={second}/>
			</div>
			<div className={styles.comparative}>
				<div className={styles.inline}>
					<OwnedStat animal={first} title={'Period'} content={<EpochBody epochRange={first.epoch}/>}/>
					<OwnedStat animal={second} title={'Period'} content={<EpochBody epochRange={second.epoch}/>}/>
				</div>
				<div className={styles.inline}>
					<OwnedStat animal={first} title={'Habitat'} content={<HabitatBody habitats={first.habitats}/>}/>
					<OwnedStat animal={second} title={'Habitat'} content={<HabitatBody habitats={second.habitats}/>}/>
				</div>
				<div className={styles.inline}>
					<OwnedStat animal={first} title={'Size'} content={<SizeBody animalSize={first.size}/>}/>
					<OwnedStat animal={second} title={'Size'} content={<SizeBody animalSize={second.size}/>}/>
				</div>
				<div className={styles.inline}>
					<OwnedStat animal={first} title={'Weight'} content={<WeightBody animalWeight={first.weight}/>}/>
					<OwnedStat animal={second} title={'Weight'} content={<WeightBody animalWeight={second.weight}/>}/>
				</div>
			</div>
		</div>
	);
}

export default AnimalComparison;
