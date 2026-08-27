import styles from './AnimalCardList.module.scss';
import type {Animal} from "../../types/animals.ts";
import AnimalCard from "../AnimalCard/AnimalCard.tsx";

type AnimalCardListProps = {
	readonly animals: Animal[];
	readonly title?: string;
	readonly description?: string;
}

function AnimalCardList({animals, title, description}: AnimalCardListProps) {
	return(
		<div className={styles.container}>
			{title && <h3>{title}</h3>}
			{description && <p>{description}</p>}
			<div className={styles.grid}>
				{
					animals.map((animal, index) => (
						<AnimalCard isReverse={false} animal={animal} key={index} />
					))
				}
			</div>
		</div>
	)
}

export default AnimalCardList;