import styles from './StatCard.module.scss';
import type {EpochRange} from "../../types/animals.ts";

type EpochBodyProps = {
	epochRange: EpochRange;
}

function EpochBody({epochRange}: EpochBodyProps) {

	const {from ,to} = epochRange;

	return (
		<div className={`${styles.rowContainer} ${styles.uppercase}`}>
			{from} → {to}
		</div>
	)
}

export default EpochBody;