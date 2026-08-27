import styles from './AnimalProfile.module.scss';
import type {Animal} from "../../types/animals.ts";
import {type QuestionCardType} from "../RelatedQuestions/QuestionCard.tsx";
import StatCard from "../StatCard/StatCard.tsx";
import EpochBody from "../StatCard/EpochBody.tsx";
import HabitatBody from "../StatCard/HabitatBody.tsx";
import SizeBody from "../StatCard/SizeBody.tsx";
import WeightBody from "../StatCard/WeightBody.tsx";
import Divider from "../Divider/Divider.tsx";
import Button from "../Button/Button.tsx";
import FactSection from "../FactSection/FactSection.tsx";
import AnimalIcon from "../AnimalIcon/AnimalIcon.tsx";
import { motion } from "motion/react";
import useCustomInteraction from "../../hooks/useCustomInteraction.ts";
import {formatLength} from "../../utils/formatLength.ts";
import {useTranslation} from "../../i18n/useTranslation.ts";

type AnimalProfileProps = {
	readonly animal: Animal;
	readonly curiosities:QuestionCardType[];
}

function AnimalProfile({animal, curiosities}: AnimalProfileProps) {

	const {t} = useTranslation();
	const {handleClick: handleTagClick} = useCustomInteraction({interactionId: 'tagClick', target: 'tags'});
	const {handleClick: handleHabitatClick} = useCustomInteraction({interactionId: 'habitatClick', target: 'habitat'});
	const {handleClick: handleSizeClick} = useCustomInteraction({interactionId: 'sizeClick', target: 'size'});
	const {handleClick: handleWeightClick} = useCustomInteraction({interactionId: 'weightClick', target: 'weight'});
	const {handleClick: handleEpochClick} = useCustomInteraction({interactionId: 'epochClick', target: 'epoch'});
	const {handleClick: categoryClick} = useCustomInteraction({interactionId: 'categoryClick', target: 'category'});

	return (
		<motion.div className={styles.container}>
			<div className={styles.grid}>
			<div className={styles.section}>
				<div className={styles.headerContainer}>
					<h2>{animal.name}</h2>
					<Button
					onClick={() => categoryClick(`${animal.status} ${animal.type}`)}
					>
						<AnimalIcon classification={animal.type} status={animal.status} size={19}/>
						{`${animal.status} ${animal.type}`}
					</Button>
				</div>
					<Divider direction={'horizontal'}/>
				{
					curiosities.map((curiosity, index) => (
						<FactSection key={`${curiosity.title}-${index}`} title={curiosity.title} description={curiosity.text} />
					))
				}
			</div>
			<div className={styles.section}>
				<div className={styles.rightContentContainer}>
					<div className={styles.desktop}>
						<Divider direction={'vertical'}/>
					</div>
					<div className={styles.imageContent}>
						<div className={styles.imageContainer}>
							<img src={animal.imageUrl} alt={animal.name}/>
						</div>
						<p>Distinctive Features</p>
						<div className={styles.featuresContainer}>
							{animal.features.slice(0,4).map((feature, index) => (
								<Button onClick={() => {
									handleTagClick(feature)
								}} key={`${feature}-${index}`}>{feature}</Button>
							))}
						</div>
					</div>
				</div>
			</div>
			</div>
			<div className={styles.statsContainer}>
				<div className={styles.statCards}>
					<StatCard title={'Epoch'} action={() => {handleEpochClick(`${animal.epoch.from} - ${animal.epoch.to}`)}} content={<EpochBody epochRange={animal.epoch}/>}/>
					<StatCard title={'Habitat'} action={() => {
						handleHabitatClick(animal.habitats.join(', '))
					}} content={<HabitatBody habitats={animal.habitats}/>}/>
					<StatCard title={'Size'} action={() => {
						handleSizeClick(`${formatLength(animal.size.minHeightCm)} - ${formatLength(animal.size.maxHeightCm)} ${t('statCard.size.height')}`);
					}} content={<SizeBody animalSize={animal.size}/>}/>
					<StatCard title={'Weight'} action={() => {handleWeightClick(`${formatLength(animal.weight.minWeightG)} - ${formatLength(animal.weight.maxWeightG)} ${t('statCard.size.weight')}`)}} content={<WeightBody animalWeight={animal.weight}/>}/>
				</div>
			</div>
		</motion.div>
	)
}

export default AnimalProfile;