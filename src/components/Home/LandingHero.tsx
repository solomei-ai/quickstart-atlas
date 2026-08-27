import styles from './Home.module.scss';
import StaggeredHeadline from "../StaggeredHeadline/StaggeredHeadline.tsx";
import {useTranslation} from "../../i18n/useTranslation.ts";

type LandingHeroProps = {
	readonly isVisible: boolean;
}

function LandingHero ({isVisible}: LandingHeroProps) {
	const {t} = useTranslation();
	return (
		<div className={styles.heroContainer}>
			<StaggeredHeadline isVisible={isVisible} text={t("hero-title")}/>
		</div>
	)
};

export default LandingHero;