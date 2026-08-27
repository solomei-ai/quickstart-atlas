import styles from './AnimalCard.module.scss';
import type {Animal} from "../../types/animals.ts";
import AnimalIcon from "../AnimalIcon/AnimalIcon.tsx";
import useCustomInteraction from "../../hooks/useCustomInteraction.ts";
import {useLoadingStore} from "../../stores/loadingStore.ts";
import {useTranslation} from "../../i18n/useTranslation.ts";

type AnimalCardProps = {
	readonly animal: Animal;
	readonly onClick?: () => void;
	readonly isReverse?: boolean;
}

function AnimalCard({animal, onClick, isReverse}: AnimalCardProps) {
	const {handleClick} = useCustomInteraction({interactionId: 'animalClick', target: 'animals', onClick});
	const isLoading = useLoadingStore(state => state.isLoading);
	const {t} = useTranslation();

	return(
		<button type={'button'} disabled={isLoading} aria-label={animal.name} onClick={() => {handleClick(animal.name)}} className={styles.container}>
			<div className={styles.header}>
				<AnimalIcon isReverse={isReverse} status={animal.status} classification={animal.type} size={18}/>
				<div className={styles.row}>
					<span>{animal.status}</span>
					<span>{animal.type}</span>
				</div>
			</div>
			<h2 className={styles.name}>{animal.name}</h2>
			<div className={styles.imageContainer}>
				<img src={animal.imageUrl} alt={animal.name} className={styles.image}/>
			</div>
			<div className={styles.bottom}>
				<div className={styles.description}>
					{animal.description}
				</div>
				<div>
				<p className={styles.heading}>{t('animalCard.distinctiveFeatures')}</p>
					<div className={styles.row}>
						{
							animal.features.slice(0,3).map((el, index) => <span key={`${el}-${index}`} className={styles.item}>{el}</span>)
						}
					</div>
				</div>
			</div>
		</button>
	)
}

export default AnimalCard;
