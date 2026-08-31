import styles from './AnimalEntry.module.scss';
import useCustomInteraction from "../../hooks/useCustomInteraction.ts";

type AnimalEntryProps = {
	name: string;
	imageUrl: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	theme?: string;
}

export function AnimalEntry({imageUrl, name, theme = 'light', size = 'md'}: AnimalEntryProps) {
	const {handleClick} = useCustomInteraction({interactionId: 'animalClick', target: 'animals'});
	const contentStyle= styles[`content-${size}`];
	return(
		<button
			type={'button'}
			onClick={() => handleClick(name)}
			aria-label={name}
			className={styles.container}>
			<div className={`${styles.imageContainer} ${contentStyle}`}>
				<img src={imageUrl} alt={`${name} image`} />
			</div>
			<div data-theme={theme} className={styles.nameContainer}>
				<h3>{name}</h3>
			</div>
		</button>
	)
}

export default AnimalEntry;