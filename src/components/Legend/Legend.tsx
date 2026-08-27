import styles from './Lengend.module.scss';
import Button from "../Button/Button.tsx";
import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {useClickOutside} from "../../hooks/useClickOutside.ts";
import {useTranslation, type MessageKey} from "../../i18n/useTranslation.ts";
import IconState from "../IconState/IconState.tsx";
import {classificationIcon, statusState} from "../AnimalIcon/AnimalIcon.tsx";
import {HABITATS, type AnimalClassification, type AnimalStatus} from "../../types/animals.ts";
import Icon from "../Icon/Icon.tsx";

const SPECIES: {classification: AnimalClassification; labelKey: MessageKey}[] = [
	{classification: 'Mammal', labelKey: 'legend.classification.Mammal'},
	{classification: 'Bird', labelKey: 'legend.classification.Bird'},
	{classification: 'Amphibian', labelKey: 'legend.classification.Amphibian'},
	{classification: 'Fish', labelKey: 'legend.classification.Fish'},
	{classification: 'Invertebrates', labelKey: 'legend.classification.Invertebrates'},
];

const STATUSES: {status: AnimalStatus; labelKey: MessageKey}[] = [
	{status: 'living', labelKey: 'legend.statuses.living'},
	{status: 'endangered', labelKey: 'legend.statuses.endangered'},
	{status: 'extinct', labelKey: 'legend.statuses.extinct'},
];

function Legend() {

	const {t} = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	function toggleOpen() {
		setIsOpen(prev => !prev);
	}

	// Dismiss the open legend when clicking anywhere outside it.
	const close = () => setIsOpen(false);
	const containerRef = useClickOutside<HTMLDivElement>(close, {enabled: isOpen});

	const variants = {
		hidden: {opacity: 0},
		visible: {opacity: 1},
	}

	return(
		<div ref={containerRef} className={styles.container}>
			<Button onClick={toggleOpen} variant={'outline-muted'} icon={"List"} >
				<span className={styles.desktop}>Legend</span>
			</Button>
			<AnimatePresence>
			{
				isOpen ? (
					<motion.div
						variants={variants}
						initial={'hidden'}
						animate={'visible'}
						exit={'hidden'}
						className={styles.legendContainer}>
						<div className={styles.topContainer}>
							<div className={styles.left}>
								<span className={styles.sectionHeader}>
									{t("legend.species")}
								</span>
								<ul className={styles.list}>
									{SPECIES.map(({classification, labelKey}) => (
										<li key={classification} className={styles.row}>
											<Icon icon={classificationIcon[classification]} size={20} color={'currentColor'} />
											<span>{t(labelKey)}</span>
										</li>
									))}
								</ul>
							</div>
							<div className={styles.right}>
								<span className={styles.sectionHeader}>
									{t("legend.status")}
								</span>
								<ul className={styles.list}>
									{STATUSES.map(({status, labelKey}) => (
										<li key={status} className={styles.row}>
											<IconState icon={'Mammal'} state={statusState[status]} size={20} />
											<span>{t(labelKey)}</span>
										</li>
									))}
								</ul>
							</div>
							</div>
							<div className={styles.bottomContainer}>
								<span className={styles.sectionHeader}>
									{t("legend.habitats")}
								</span>
								<ul className={`${styles.list} ${styles.habitatList}`}>
									{HABITATS.map((habitat) => (
										<div data-theme={habitat} className={styles.habitatContainer}>
											<div className={styles.habitatPlaceholder}/>
											<li key={habitat} className={styles.row}>
												<span>{habitat}</span>
											</li>
										</div>
									))}
								</ul>
							</div>
					</motion.div>
				) : null
			}
			</AnimatePresence>
		</div>
	)
}

export default Legend;
