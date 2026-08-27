import styles from "./HabitatCard.module.scss";
import type {HabitatInfo} from "../../types/animals.ts";
import FactSection from "../FactSection/FactSection.tsx";
import StatCard from "../StatCard/StatCard.tsx";
import {useTranslation} from "../../i18n/useTranslation.ts";
import Icon from "../Icon/Icon.tsx";

type HabitatCardProps = {
	habitat: HabitatInfo;
}

function HabitatCard({habitat}: HabitatCardProps) {
	const {t} = useTranslation();
	return(
		<div className={styles.container}>
			<div className={styles.category} data-theme={habitat.habitat} >
				<Icon icon={'Flag'} color={'currentColor'} />
				{habitat.category}
			</div>
			<FactSection titleSize={'large'} title={habitat.name} description={habitat.description} />
			<div className={styles.contentContainer}>
				<div className={styles.section}>
					<div
						className={styles.imageContainer}
						style={habitat.imageUrl ? {backgroundImage: `url(${habitat.imageUrl})`} : undefined}
					/>
				</div>
				<div className={`${styles.section} ${styles.right}`}>
					<div className={styles.featuresContainer}>
						<p className={styles.header}>{t('habitatCard.distinctiveFeatures')}</p>
						<div className={styles.chipsContainer}>
							{
								habitat.features.map((feature, i) => (
									<div className={styles.chip} key={i}>{feature}</div>
								))
							}
						</div>
					</div>
					<div className={styles.cardsContainer}>
						<StatCard title={t('habitatCard.climate')} action={() => {}} content={habitat.climate}/>
						<StatCard title={t('habitatCard.rainfall')} action={() => {}} content={habitat.rainfall}/>
						<StatCard title={t('habitatCard.drySeason')} action={() => {}} content={habitat.drySeason}/>
						<StatCard title={t('habitatCard.canopy')} action={() => {}} content={habitat.canopy}/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HabitatCard;