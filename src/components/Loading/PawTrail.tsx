import styles from './PawTrail.module.scss';
import {Fragment, useEffect, useRef, useState, type ComponentType, type SVGProps} from 'react';
import {motion, useReducedMotion} from 'motion/react';
import {EASE_OUT_EXPO} from '../../lib/easings.ts';

type PawComponent = ComponentType<SVGProps<SVGSVGElement>>;
type Side = 'l' | 'r';

const modules = import.meta.glob<PawComponent>('../../assets/paws/*.svg', {
	query: '?react',
	import: 'default',
	eager: true,
});

const PAWS: Record<string, Record<Side, PawComponent>> = {};
for (const [path, component] of Object.entries(modules)) {
	const match = path.match(/\/(\w+)_([lr])\.svg$/);
	if (!match) continue;
	const [, animal, side] = match;
	PAWS[animal] = {...PAWS[animal], [side]: component};
}
const ANIMALS = Object.keys(PAWS).filter(animal => PAWS[animal].l && PAWS[animal].r);

// Flat list of every paw SVG (both sides for each animal), for consumers that
// want to render all the icons rather than animate walking trails.
export const PAW_ICONS: PawComponent[] = ANIMALS.flatMap(animal => [
	PAWS[animal].l,
	PAWS[animal].r,
]);

type PawPrint = {
	x: number;
	y: number;
	rotationDeg: number;
	side: Side;
	index: number;
};

type Walk = {
	id: number;
	animal: string;
	pawHeight: number;
	prints: PawPrint[];
};

type PawTrailProps = {
	readonly spawnEveryMs?: number;
	readonly stepMs?: number;
	readonly pawHeight?: number;
	readonly maxConcurrent?: number;
};

// How far past the container edge a walk starts/ends, so trails enter and
// leave off-screen instead of popping in at the border.
const OFFSCREEN_MARGIN = 60;
const MAX_STEPS = 20;
// Default paw height as a fraction of the container height, when no
// pawHeight prop is given.
const PAW_HEIGHT_RATIO = 0.1;
// Random candidate paths generated per spawn; the one farthest from what is
// already on screen wins, so trails spread instead of clustering.
const SPAWN_CANDIDATES = 8;
// How many past start points to keep steering new walks away from.
const RECENT_STARTS = 5;
const PRINT_LIFE_S = 5.2;
const MAX_OPACITY = 0.25;

function randomEdgePoint(edge: number, width: number, height: number) {
	switch (edge) {
		case 0:
			return {x: Math.random() * width, y: -OFFSCREEN_MARGIN};
		case 1:
			return {x: width + OFFSCREEN_MARGIN, y: Math.random() * height};
		case 2:
			return {x: Math.random() * width, y: height + OFFSCREEN_MARGIN};
		default:
			return {x: -OFFSCREEN_MARGIN, y: Math.random() * height};
	}
}

function generateWalk(id: number, width: number, height: number, pawHeight: number): Walk {
	const startEdge = Math.floor(Math.random() * 4);
	const endEdge = (startEdge + 1 + Math.floor(Math.random() * 3)) % 4;
	const start = randomEdgePoint(startEdge, width, height);
	const end = randomEdgePoint(endEdge, width, height);

	const dx = end.x - start.x;
	const dy = end.y - start.y;
	const distance = Math.hypot(dx, dy);
	const dir = {x: dx / distance, y: dy / distance};
	const perp = {x: -dir.y, y: dir.x};
	// Paws are drawn toes-up in their viewBox, so facing the heading is +90°.
	const heading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

	const stride = pawHeight * 1.7;
	const track = pawHeight * 0.45;
	const steps = Math.min(Math.floor(distance / stride), MAX_STEPS);
	const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];

	const prints: PawPrint[] = [];
	for (let i = 0; i < steps; i++) {
		const side: Side = i % 2 === 0 ? 'l' : 'r';
		const lateral = ((side === 'l' ? -track : track) / 2);
		prints.push({
			x: start.x + dir.x * i * stride + perp.x * lateral + (Math.random() - 0.5) * 6,
			y: start.y + dir.y * i * stride + perp.y * lateral + (Math.random() - 0.5) * 6,
			rotationDeg: heading + (Math.random() - 0.5) * 12,
			side,
			index: i,
		});
	}
	return {id, animal, pawHeight, prints};
}

type Point = {x: number; y: number};

// Rank a candidate walk for spread. Distance from recent start points is the
// primary term (starting near a previous trail is what reads as clustering);
// distance from live prints only breaks ties, capped so an emptying screen
// doesn't drown out start separation.
function clearance(candidate: Walk, liveWalks: Walk[], recentStarts: Point[]): number {
	let printClearance = Infinity;
	for (const print of candidate.prints) {
		for (const walk of liveWalks) {
			for (const other of walk.prints) {
				printClearance = Math.min(printClearance, Math.hypot(print.x - other.x, print.y - other.y));
			}
		}
	}
	let startClearance = Infinity;
	const start = candidate.prints[0];
	for (const recent of recentStarts) {
		startClearance = Math.min(startClearance, Math.hypot(start.x - recent.x, start.y - recent.y));
	}
	return startClearance + Math.min(printClearance, 400) * 0.3;
}

function PawTrail({spawnEveryMs = 1200, stepMs = 380, pawHeight, maxConcurrent = 5}: PawTrailProps) {
	const [walks, setWalks] = useState<Walk[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	// Mirrors `walks` so spawn() can score candidates without stale closures.
	const liveWalksRef = useRef<Walk[]>([]);
	const recentStartsRef = useRef<Point[]>([]);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion || ANIMALS.length === 0) return;
		const timeouts = new Set<number>();
		let nextId = 0;

		const spawn = () => {
			const container = containerRef.current;
			if (!container) return;
			const {width, height} = container.getBoundingClientRect();
			if (!width || !height) return;
			if (liveWalksRef.current.length >= maxConcurrent) return;

			const resolvedPawHeight = pawHeight ?? height * PAW_HEIGHT_RATIO;
			let walk: Walk | null = null;
			let bestScore = -Infinity;
			for (let i = 0; i < SPAWN_CANDIDATES; i++) {
				const candidate = generateWalk(nextId, width, height, resolvedPawHeight);
				if (candidate.prints.length === 0) continue;
				const score = clearance(candidate, liveWalksRef.current, recentStartsRef.current);
				if (score > bestScore) {
					bestScore = score;
					walk = candidate;
				}
			}
			if (!walk) return;
			nextId++;
			const chosen = walk;

			liveWalksRef.current = [...liveWalksRef.current, chosen];
			recentStartsRef.current = [...recentStartsRef.current, chosen.prints[0]].slice(-RECENT_STARTS);
			setWalks(current => [...current, chosen]);

			const lifeMs = chosen.prints.length * stepMs + PRINT_LIFE_S * 1000 + 200;
			const timeout = window.setTimeout(() => {
				timeouts.delete(timeout);
				liveWalksRef.current = liveWalksRef.current.filter(w => w.id !== chosen.id);
				setWalks(current => current.filter(w => w.id !== chosen.id));
			}, lifeMs);
			timeouts.add(timeout);
		};

		spawn();
		const interval = setInterval(spawn, spawnEveryMs);
		return () => {
			clearInterval(interval);
			timeouts.forEach(timeout => clearTimeout(timeout));
			liveWalksRef.current = [];
			recentStartsRef.current = [];
			setWalks([]);
		};
	}, [reduceMotion, spawnEveryMs, stepMs, pawHeight, maxConcurrent]);

	if (reduceMotion) return null;

	return (
		<div ref={containerRef} className={styles.trail} aria-hidden="true">
			{walks.map(walk => (
				// Keyed per walk: without this, removing a finished walk shifts the
				// remaining ones to a new position in the children array, React
				// remounts their prints and every animation restarts from opacity 0.
				<Fragment key={walk.id}>
					{walk.prints.map(print => {
						const Paw = PAWS[walk.animal][print.side];
						return (
							<motion.div
								key={print.index}
								className={styles.print}
								style={{
									left: print.x,
									top: print.y,
									height: walk.pawHeight,
									rotate: print.rotationDeg,
									x: '-50%',
									y: '-50%',
								}}
								initial={{opacity: 0}}
								animate={{opacity: [0, MAX_OPACITY, MAX_OPACITY, 0]}}
								transition={{
									delay: (print.index * stepMs) / 1000,
									duration: PRINT_LIFE_S,
									times: [0, 0.1, 0.72, 1],
									ease: EASE_OUT_EXPO,
								}}
							>
								<Paw/>
							</motion.div>
						);
					})}
				</Fragment>
			))}
		</div>
	);
}

export default PawTrail;
