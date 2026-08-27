import styles from './StatCard.module.scss';
import type {AnimalSize} from "../../types/animals.ts";
import {formatLength} from "../../utils/formatLength.ts";
import {useTranslation} from "../../i18n/useTranslation.ts";
import Icon from "../Icon/Icon.tsx";

type SizeBodyProps = {
	animalSize: AnimalSize;
}

const AVG_HAND_SIZE_CM = 18;
const AVG_HUMAN_SIZE_CM = 172;

// Vertical budget (px) for the comparison. Whichever is taller — the reference
// icon or the animal bar — fills this, and the other scales to match, so the
// drawing stays to-scale and never overflows the card.
const MAX_DISPLAY_PX = 56;

function SizeBody({animalSize}: SizeBodyProps) {
	const {t} = useTranslation();
	const {minHeightCm, maxHeightCm} = animalSize;

	// Small animals are easier to grasp next to a hand; larger ones next to a human.
	const useHand = maxHeightCm <= AVG_HAND_SIZE_CM;
	const referenceIcon = useHand ? 'Hand' : 'Human';
	const referenceCm = useHand ? AVG_HAND_SIZE_CM : AVG_HUMAN_SIZE_CM;

	// Single scale shared by icon and bar: the taller subject fills the budget.
	const pxPerCm = MAX_DISPLAY_PX / Math.max(referenceCm, maxHeightCm);
	const iconPx = referenceCm * pxPerCm;
	const animalBarPx = maxHeightCm * pxPerCm;

	return (
		<div className={styles.sizesContainer}>
			<div className={styles.sizeComparison}>
				<Icon icon={referenceIcon} size={iconPx} />
				<div className={styles.animalBar} style={{height: animalBarPx}} />
			</div>
			<span>{formatLength(minHeightCm)} - {formatLength(maxHeightCm)} {t('statCard.size.height')}</span>
		</div>
	)
}

export default SizeBody;