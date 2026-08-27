import styles from './StatCard.module.scss';
import type {Habitat} from "../../types/animals.ts";

type HabitatBodyProps = {
	readonly habitats: Habitat[];
}

function HabitatBody({habitats}: HabitatBodyProps) {
	return (
		<div className={`${styles.rowContainer} ${styles.uppercase}`}>
			{habitats.slice(0,3).map((habitat, index) => (
				<span key={index}>
					{index > 0 && ', '}
					{habitat}
				</span>
			))}
		</div>
	)
}

export default HabitatBody;