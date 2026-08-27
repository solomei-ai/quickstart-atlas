import styles from './History.module.scss';
import Icon from "../Icon/Icon.tsx";
import {formatHistoryDate} from "../../utils/formatHistoryDate.ts";
import type {InteractionType} from "./history.ts";
import HistoryFlyout from "./HistoryFlyout.tsx";
import {useRef, useState} from "react";
import {createPortal} from "react-dom";

type HistoryTileProps = {
	readonly date: Date;
	readonly title: string;
	readonly onClick: () => void;
	readonly interactions: InteractionType[];
}

function HistoryTile({date, title, onClick, interactions}: HistoryTileProps) {
	const triggerRef = useRef<HTMLDivElement>(null);
	// The flyout is rendered in a portal so it escapes the history list's
	// overflow clipping (the list scrolls, which clips absolutely-positioned
	// children) as well as any transformed ancestor. Position is derived from
	// the trigger's rect: right edge aligned, top flush with the trigger bottom.
	const [flyoutPos, setFlyoutPos] = useState<{top: number; right: number}>();

	function openFlyout() {
		const trigger = triggerRef.current;
		// Hover-only affordance, matching the original `pointer: fine` gate.
		if (!trigger || !window.matchMedia('(pointer: fine)').matches) return;
		const rect = trigger.getBoundingClientRect();
		setFlyoutPos({top: rect.bottom, right: window.innerWidth - rect.right});
	}

	function closeFlyout() {
		setFlyoutPos(undefined);
	}

	return(
		<button
			onClick={onClick}
			className={styles.historyTileContainer}>
			<div className={styles.tileHeader}>
				<div className={styles.inline}>
					<Icon icon={'MagnifyingGlass'} color={'currentColor'} />
					<span>{formatHistoryDate(date)}</span>
				</div>
				<div
					ref={triggerRef}
					className={`${styles.inline} ${styles.hoverable}`}
					onMouseEnter={openFlyout}
					onMouseLeave={closeFlyout}>
					{interactions.length}
					<Icon icon={'Journey'} color={'currentColor'} size={12} />
				</div>
			</div>
			<h4>{title}</h4>
			{flyoutPos && createPortal(
				<div className={styles.flyout} style={{top: flyoutPos.top, right: flyoutPos.right}}>
					<HistoryFlyout interactions={interactions}/>
				</div>,
				document.body,
			)}
		</button>
	)
}

export default HistoryTile;
