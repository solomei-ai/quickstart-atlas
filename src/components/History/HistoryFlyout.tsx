import styles from './History.module.scss';
import type {InteractionType} from "./history.ts";
import MapIcon from "./MapIcon.tsx";

type HistoryFlyoutProps = {
	readonly interactions: InteractionType[];
}

const MAX_ITEMS = 8;

function HistoryFlyout({interactions}: HistoryFlyoutProps) {

	const extraElement = interactions.length - 10;

	return(
		<div className={styles.flyoutContainer}>
			<div className={styles.flyoutSection}>
				{interactions.slice(0, MAX_ITEMS).map((interaction) => <MapIcon interaction={interaction} key={interaction.id} />)}
				{extraElement > 0 ? <div className={styles.extraItemContainer}>+{extraElement}</div> : null}
			</div>
		</div>
	)
};

export default HistoryFlyout;