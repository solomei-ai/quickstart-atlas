import {useState} from "react";
import styles from './IntentTab.module.scss';
import Button from "../Button/Button.tsx";
import {useTranslation} from "../../i18n/useTranslation.ts";
import CompassImg from '../../assets/assets/compass.png';
import BinocularImg from '../../assets/assets/binoculars.png';
import {useHistoryStore} from "../../stores/historyStore.ts";
import HistoryTile from "../History/HistoryTile.tsx";
import {createPortal} from "react-dom";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog.tsx";
import type {HistoryEntry} from "../History/history.ts";

type LogbookProps = {
	readonly text: string;
	readonly onClose: () => void;
	readonly onSelectStory: (story: HistoryEntry) => void;
	readonly onNewStory: () => void;
}

function Logbook({text, onClose, onSelectStory, onNewStory}: LogbookProps) {

	const {t} = useTranslation();
	const {entries, clearHistory} = useHistoryStore();
	const isHistoryEmpty = entries.length === 0;
	// Most recent expedition first.
	const sortedEntries = [...entries].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	const [presentConfirmDialogue, setPresentConfirmDialogue] = useState(false);
	function handleCancel() {
		setPresentConfirmDialogue(false);
	}

	async function handleConfirm() {
		await clearHistory();
		setPresentConfirmDialogue(false);
	}

	return (
		<div className={styles.logbookGrid}>
			<div className={`${styles.section} ${styles.spaceBetween}`}>
			<div className={styles.title}>
					<h4>{t('intent.logbook')}</h4>
					<span dangerouslySetInnerHTML={{__html: t('intent.sub')}} />
				</div>
				<img className={styles.illustration} src={CompassImg} alt={"Compass illustration"}/>
				<div className={styles.content}>
					<p className={styles.sub}>{t("intent.about_you")}</p>
					<span>{text}</span>
				</div>
			</div>
			<div className={`${styles.section} ${styles.spaceBetween}`}>
				<div className={styles.top}>
					<div className={styles.desktop}>
						<Button variant={'outline'} onClick={onClose}>Close</Button>
					</div>
					<div className={styles.historyEntryes}>
						<p className={styles.sub}>{t("history.your_expeditions")}</p>
						<div className={styles.historyList} data-lenis-prevent>
							{
								isHistoryEmpty ? (
									<div className={styles.emptyContainer}>
										<img src={BinocularImg} alt={"Compass illustration"}/>
										<p>{t("history.empty")}</p>
									</div>
								) : sortedEntries.map((entry) => (
									<HistoryTile
										key={entry.id}
										date={new Date(entry.date)}
										title={entry.title}
										onClick={() => onSelectStory(entry)}
										interactions={entry.interactions}
									/>
								))
							}
						</div>
					</div>
				</div>
				<div className={styles.actionsContainer}>
					<Button
						disabled={isHistoryEmpty}
						variant={'fill'}
						onClick={onNewStory}>
							{t("history.new_expedition")}
					</Button>
					<Button
						disabled={isHistoryEmpty}
						variant={'outline'}
						icon={'Wind'}
						onClick={() => {
							setPresentConfirmDialogue(true);
						}}>
						{t("history.clear_history")}
					</Button>
				</div>
			</div>
			{
				presentConfirmDialogue && createPortal(
					<ConfirmDialog
						variant={'light'}
						title={'Clear history'}
						message={'Are you sure?'}
						confirmText={'Delete'}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
					/>,
					document.getElementById('root')!
				)
			}
		</div>
	)
}

export default Logbook;
