import {useLayoutEffect, useRef, useState} from "react";
import styles from './History.module.scss';
import type {HistoryEntry} from "./history.ts";
import MapIcon from "./MapIcon.tsx";
import {Icon} from "../Icon/Icon.tsx";
import Button from "../Button/Button.tsx";

type HistoryMapProps = {
	// Fires when a node is tapped, with the Thamyr chapter id of the round it
	// produced (undefined for journeys recorded before chapter ids were tracked).
	readonly onClick: (chapterId?: string) => void;
	readonly onDismiss: () => void;
	readonly historyEntry?: HistoryEntry;
}

// The MapIcon box is padding-sm (12px) + icon (22px) + padding-sm (12px) = 46px,
// so its centre sits 23px below the node's top edge. The dashed path connects
// icon centres, so we offset each node up by this amount.
const ICON_HALF = 23;

// Smooth (Catmull-Rom → cubic bézier) path through the node centres, so the
// dashed trail curves gently between nodes instead of drawing straight segments.
function buildSmoothPath(pts: {x: number; y: number}[]): string {
	if (pts.length < 2) {return ''}
	let d = `M ${pts[0].x},${pts[0].y}`;
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i - 1] ?? pts[i];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[i + 2] ?? p2;
		const cp1x = p1.x + (p2.x - p0.x) / 6;
		const cp1y = p1.y + (p2.y - p0.y) / 6;
		const cp2x = p2.x - (p3.x - p1.x) / 6;
		const cp2y = p2.y - (p3.y - p1.y) / 6;
		d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
	}
	return d;
}

function HistoryMap({onClick, onDismiss, historyEntry}: HistoryMapProps) {

	const trackRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		const el = trackRef.current;
		if (!el) {return}
		const observer = new ResizeObserver(([entry]) => {
			setWidth(entry.contentRect.width);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	if (!historyEntry) {return undefined}

	const date = new Date(historyEntry.date);
	const isToday = new Date().toDateString() === date.toDateString();
	const dayLabel = isToday ? 'Today' : date.toLocaleDateString([], {day: '2-digit', month: 'short'});
	const timeLabel = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

	const isMobile = width > 0 && width < 600;
	const cols = isMobile ? 2 : 4;
	const rowGap = isMobile ? 210 : 230;
	const topOffset = 56;
	const padX = isMobile ? 70 : 112;
	// Vertical wobble so the trail rises and dips between nodes rather than running flat.
	const wobble = isMobile ? 22 : 30;
	// Horizontal stagger so even rows sit slightly offset from odd rows instead of
	// lining up in fixed columns — makes the trail read as looser and more sparse.
	const rowShift = isMobile ? 18 : 28;

	// START pin, then one node per interaction. Nodes snake in a boustrophedon:
	// row 0 runs left→right, row 1 right→left, and so on — dropping to the next row
	// on whichever side the previous row ended. The track grows so the map scrolls.
	const points = [{kind: 'start' as const}, ...historyEntry.interactions.map((interaction) => ({kind: 'node' as const, interaction}))];

	const step = cols > 1 ? (width - 2 * padX) / (cols - 1) : 0;

	const positions = points.map((_, index) => {
		const row = Math.floor(index / cols);
		const posInRow = index % cols;
		const col = row % 2 === 0 ? posInRow : cols - 1 - posInRow;
		const x = padX + col * step + (row % 2 === 0 ? -rowShift : rowShift);
		const y = topOffset + row * rowGap + (index % 2 === 0 ? -wobble : wobble);
		return {x, y};
	});

	const rows = Math.ceil(points.length / cols);
	const totalHeight = topOffset + (rows - 1) * rowGap + wobble + 160;
	const path = buildSmoothPath(positions);

	return(
		<div className={styles.mapContainer}>
			<div className={styles.mapHeader}>
				<Button icon={'ChevronLeft'} variant={'outline'} onClick={onDismiss}>
					Back
				</Button>
				<div className={styles.mapMeta}>
					<span>{dayLabel}</span>
					<span>{timeLabel}</span>
				</div>
				<h3 className={styles.mapTitle}>{historyEntry.title}</h3>
			</div>

			<div className={styles.mapScroll} data-lenis-prevent>
				<div ref={trackRef} className={styles.mapTrack} style={{height: totalHeight}}>
					{width > 0 && (
						<>
							<svg className={styles.connectors} width={width} height={totalHeight} aria-hidden={'true'}>
								<path
									d={path}
									fill={'none'}
									stroke={'currentColor'}
									strokeWidth={2}
									strokeLinecap={'round'}
									strokeLinejoin={'round'}
									strokeDasharray={'1 9'}
								/>
							</svg>

							{points.map((point, index) => (
								<div
									key={point.kind === 'start' ? 'start' : point.interaction.id}
									className={styles.mapNode}
									style={{left: positions[index].x, top: positions[index].y - ICON_HALF}}
								>
									{point.kind === 'start' ? (
										<>
											<div className={styles.startPin}>
												<Icon icon={'GeoLocation'} size={22} color={'currentColor'} />
											</div>
											<span className={styles.nodeLabel}>Start</span>
										</>
									) : (
										<button type={'button'} className={styles.nodeButton} onClick={() => onClick(point.interaction.chapterId)}>
											<MapIcon interaction={point.interaction} hasInteractionIcon />
											<span className={styles.nodeLabel}>{point.interaction.target}</span>
											<span className={styles.nodePill}>{point.interaction.label}</span>
										</button>
									)}
								</div>
							))}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default HistoryMap;
