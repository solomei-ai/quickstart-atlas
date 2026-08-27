import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Feature, FeatureCollection, Geometry} from 'geojson';
import type {Topology} from 'topojson-specification';

import styles from './WorldMap.module.scss';
import type {Animal} from '../../types/animals.ts';
import AnimalCard from '../AnimalCard/AnimalCard.tsx';
import AnimalMarker from './AnimalMarker.tsx';
import {EASE_OUT_EXPO, T} from '../../lib/easings.ts';
import worldTopo from 'world-atlas/countries-110m.json';
import Waves from '../../assets/map/waves.png';
import {useClickOutside} from '../../hooks/useClickOutside.ts';

// --- Static geo data ---------------------------------------------------------
// Convert the TopoJSON countries to GeoJSON once, at module load. Antarctica is
// dropped so the map crops the same way the raster background (`map-bg.png`) does.
const countries: Feature<Geometry>[] = (
	feature(worldTopo as unknown as Topology, (worldTopo as unknown as Topology).objects.countries) as FeatureCollection<Geometry>
).features.filter((f) => (f.properties as {name?: string})?.name !== 'Antarctica');

const worldCollection: FeatureCollection<Geometry> = {type: 'FeatureCollection', features: countries};

const ICON_SIZE = 12;
const CARD_WIDTH = 320;
const CARD_GAP = 12;
const TOOLTIP_GAP = 8;
// Seconds between each newly-added marker's entrance.
const MARKER_STAGGER = 0.01;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// Decorative wave stickers anchored to open-ocean coordinates so they stay at
// "sea level" — projected through the same Mercator fit as the markers, they
// keep their spot on resize/pan. One sits bottom-left (South Pacific), the other
// top-right (North Pacific).
const WAVES: {lng: number; lat: number}[] = [
	{lng: -135, lat: -38},
	{lng: 148, lat: 81},
];

type WorldMapProps = {
	readonly animals: Animal[];
};

type Placed = {
	animal: Animal;
	x: number;
	y: number;
};

/**
 * A non-zoomable world map rendered from GeoJSON, styled to match the
 * paper-textured `map-bg.png` background: light-gray landmasses with thin
 * borders, blended with `multiply` so it reads as printed on the page.
 *
 * The map is fitted to 90% of the container height and centered, so on
 * narrow/mobile viewports it can still become wider than the screen. The map +
 * markers therefore live in a horizontally **pannable** track (X axis only),
 * which lets the user reach the parts of the world that would otherwise be
 * cropped off-screen. On wide desktop viewports the content fits exactly and
 * no panning is possible.
 *
 * Each animal is placed at its `coordinates` via the same Mercator projection
 * used to draw the map, so icons stay glued to the correct spot on resize.
 * Hovering an icon shows the animal's name; clicking opens its `AnimalCard`.
 */
function WorldMap({animals}: WorldMapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({width: 0, height: 0});
	// The container's position in *document* space, used to place the portalled
	// overlay layer (see `measureOrigin` below).
	const [origin, setOrigin] = useState({left: 0, top: 0});
	const [scrollLeft, setScrollLeft] = useState(0);
	const [hovered, setHovered] = useState<string | null>(null);
	const [openSlug, setOpenSlug] = useState<string | null>(null);
	const reduceMotion = useReducedMotion();

	// Fade the whole map out as this (first) section scrolls up out of view.
	// `start start` = section top at viewport top (initial state → progress 0);
	// `end start` = section fully scrolled past the top (progress 1). The map is
	// gone by the time the section is halfway out.
	const {scrollYProgress} = useScroll({target: containerRef, offset: ['start start', 'end start']});
	const mapOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

	// The tooltip/card layer is portalled out of this subtree (see the bottom of
	// the render), so its children can't be positioned relative to the container
	// any more. Recording the container's document-space offset lets the layer be
	// placed over the container while keeping every position below in
	// container-local coordinates. Document space (not viewport space) means the
	// layer scrolls with the page like the map itself, with no scroll listener.
	const measureOrigin = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		setOrigin({left: rect.left + window.scrollX, top: rect.top + window.scrollY});
	}, []);

	// Track the container size so the projection can re-fit responsively.
	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new ResizeObserver(([entry]) => {
			const {width, height} = entry.contentRect;
			setSize({width, height});
			measureOrigin();
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [measureOrigin]);

	// Mercator projection fitted to 90% of the container height ("contain"
	// semantics on the Y axis), then centered both vertically and horizontally.
	// The track is never narrower than the container, so the map stays centered
	// when it fits; on narrow/tall viewports where the map is still wider than
	// the container, the track grows to the map's width and horizontal panning
	// (via the scroll offset) kicks in.
	const fit = useMemo(() => {
		const {width, height} = size;
		if (width === 0 || height === 0) return null;

		const proj = geoMercator().scale(1).translate([0, 0]);
		const [[x0, y0], [x1, y1]] = geoPath(proj).bounds(worldCollection);
		const contentHeight = height * 0.9;
		const scale = contentHeight / (y1 - y0);
		const rawContentWidth = scale * (x1 - x0);
		const contentWidth = Math.max(rawContentWidth, width);
		const offsetX = (contentWidth - rawContentWidth) / 2;
		const tx = offsetX - scale * x0;
		const ty = (height - contentHeight) / 2 - scale * y0;
		return {
			projection: proj.scale(scale).translate([tx, ty]),
			contentWidth,
		};
	}, [size]);

	const contentWidth = fit?.contentWidth ?? size.width;

	// Country outlines as SVG path strings, recomputed only when the fit changes.
	const paths = useMemo(() => {
		if (!fit) return [];
		const path = geoPath(fit.projection);
		return countries.map((c) => path(c) ?? '');
	}, [fit]);

	// Project every animal's coordinates to a pixel position within the track.
	const placed = useMemo<Placed[]>(() => {
		if (!fit) return [];
		return animals.flatMap((animal) => {
			if (!animal.coordinates) return [];
			const point = fit.projection([animal.coordinates.lng, animal.coordinates.lat]);
			if (!point) return [];
			return [{animal, x: point[0], y: point[1]}];
		});
	}, [animals, fit]);

	// Project the wave stickers to pixel positions the same way animals are placed.
	const placedWaves = useMemo(() => {
		if (!fit) return [];
		return WAVES.flatMap((wave) => {
			const point = fit.projection([wave.lng, wave.lat]);
			return point ? [{x: point[0], y: point[1]}] : [];
		});
	}, [fit]);

	// Stagger the entrance, but only over markers that are new since the last
	// render: the first batch cascades in, animals added later cascade among
	// themselves, and existing markers (which never remount) don't re-animate.
	const seenSlugs = useRef<Set<string>>(new Set());
	const enterDelays = useMemo(() => {
		const delays = new Map<string, number>();
		let newCount = 0;
		for (const {animal} of placed) {
			if (seenSlugs.current.has(animal.slug)) {
				delays.set(animal.slug, 0);
			} else {
				delays.set(animal.slug, newCount * MARKER_STAGGER);
				newCount += 1;
			}
		}
		return delays;
	}, [placed]);

	useEffect(() => {
		for (const {animal} of placed) seenSlugs.current.add(animal.slug);
	}, [placed]);

	// Start the pan centered on the world, and re-center when the fit changes
	// (e.g. an orientation change). `scrollLeft` state is the single source of
	// truth for converting track coordinates to on-screen coordinates below.
	useLayoutEffect(() => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollLeft = Math.max(0, (contentWidth - size.width) / 2);
		setScrollLeft(el.scrollLeft);
	}, [contentWidth, size.width]);

	const openAnimal = openSlug ? placed.find((p) => p.animal.slug === openSlug) ?? null : null;

	const closeCard = useCallback(() => setOpenSlug(null), []);

	// While the user pans, dismiss any open card/tooltip and keep `scrollLeft` in
	// sync so the (closed) overlays would re-anchor correctly once reopened.
	const onScroll = useCallback(() => {
		setScrollLeft(scrollerRef.current?.scrollLeft ?? 0);
		setOpenSlug(null);
		setHovered(null);
	}, []);

	// Close the open card on Escape.
	useEffect(() => {
		if (!openSlug) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeCard();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [openSlug, closeCard]);

	// Close the card on an outside click. Markers live in a separate subtree from
	// the card, so they're ignored here — a marker click is handled by its own
	// toggle rather than counting as "outside".
	const cardRef = useClickOutside<HTMLDivElement>(closeCard, {
		enabled: Boolean(openSlug),
		ignore: [`.${styles.marker}`],
	});

	// Measure the open card so it can be positioned fully inside the container.
	// `offsetHeight` ignores the entrance scale transform, so measuring during the
	// animation is safe and repositions synchronously before paint (no flash).
	const [cardHeight, setCardHeight] = useState(0);

	useLayoutEffect(() => {
		if (!openAnimal || !cardRef.current) {
			setCardHeight(0);
			return;
		}
		setCardHeight(cardRef.current.offsetHeight);
	}, [openAnimal, size]);

	// The card is never allowed to be wider/taller than the container (minus a gap
	// on each side); content beyond `maxCardHeight` scrolls inside the card.
	const cardWidth = size.width > 0 ? Math.min(CARD_WIDTH, size.width - CARD_GAP * 2) : CARD_WIDTH;
	const maxCardHeight = Math.max(0, size.height - CARD_GAP * 2);

	// Anchor the card beside its marker, then clamp both axes so it never overflows.
	const cardPosition = useMemo(() => {
		if (!openAnimal) return null;
		const iconEdge = ICON_SIZE / 2 + CARD_GAP;
		// The marker's on-screen x accounts for the current horizontal pan.
		const iconX = openAnimal.x - scrollLeft;

		// Prefer opening to the right of the icon; fall back to the left when the
		// card wouldn't fit there. Either way the result is clamped horizontally.
		const opensRight = iconX + iconEdge + cardWidth <= size.width - CARD_GAP;
		const rawLeft = opensRight ? iconX + iconEdge : iconX - iconEdge - cardWidth;
		const left = clamp(rawLeft, CARD_GAP, size.width - cardWidth - CARD_GAP);

		// Center the card on the icon vertically, using the on-screen (capped) height.
		const visibleHeight = Math.min(cardHeight, maxCardHeight);
		const rawTop = openAnimal.y - visibleHeight / 2;
		const top = clamp(rawTop, CARD_GAP, size.height - visibleHeight - CARD_GAP);

		return {left, top, opensRight};
	}, [openAnimal, size, scrollLeft, cardWidth, cardHeight, maxCardHeight]);

	// The tooltip is a single container-level element following the hovered marker,
	// hidden while that marker's card is open.
	const hoveredAnimal = hovered ? placed.find((p) => p.animal.slug === hovered) ?? null : null;
	const showTooltip = Boolean(hoveredAnimal) && openSlug !== hovered;

	// Measure the tooltip (its width depends on the animal's name) so it can be
	// clamped inside the container, same as the card.
	const tooltipRef = useRef<HTMLHeadingElement>(null);
	const [tooltipSize, setTooltipSize] = useState({width: 0, height: 0});

	useLayoutEffect(() => {
		if (!showTooltip || !tooltipRef.current) return;
		setTooltipSize({width: tooltipRef.current.offsetWidth, height: tooltipRef.current.offsetHeight});
	}, [showTooltip, hovered, size]);

	// Prefer sitting above the icon; flip below when it would clip the top edge,
	// and clamp both axes so the tooltip never overflows the container.
	const tooltipPosition = useMemo(() => {
		if (!hoveredAnimal) return null;
		const {width: tw, height: th} = tooltipSize;
		const edge = ICON_SIZE / 2 + TOOLTIP_GAP;
		// The marker's on-screen x accounts for the current horizontal pan.
		const iconX = hoveredAnimal.x - scrollLeft;

		let top = hoveredAnimal.y - edge - th;
		if (top < TOOLTIP_GAP) top = hoveredAnimal.y + edge;
		top = clamp(top, TOOLTIP_GAP, Math.max(TOOLTIP_GAP, size.height - th - TOOLTIP_GAP));

		const left = clamp(iconX - tw / 2, TOOLTIP_GAP, Math.max(TOOLTIP_GAP, size.width - tw - TOOLTIP_GAP));
		return {left, top};
	}, [hoveredAnimal, tooltipSize, scrollLeft, size]);

	// Re-anchor the layer right before an overlay appears: the container can have
	// moved in document space since the last measure (content above it growing),
	// and the ResizeObserver above only fires when the container itself resizes.
	useLayoutEffect(() => {
		if (!openSlug && !hovered) return;
		measureOrigin();
	}, [openSlug, hovered, measureOrigin]);

	// Mirror the map's scroll-fade onto the layer, but only while it's actually
	// fading. An element that carries an `opacity` style at all — even `1` — gets
	// its own composited render surface, which counts as a *backdrop root*: the
	// `backdrop-filter` on AnimalCard's surface would then sample this layer's own
	// (empty) content instead of the map, and the frosted glass disappears.
	// Clearing the property at rest keeps the blur; mid-fade the card is on its
	// way out anyway.
	const layerRef = useRef<HTMLDivElement>(null);
	useMotionValueEvent(mapOpacity, 'change', (value) => {
		const el = layerRef.current;
		if (!el) return;
		if (value >= 1) el.style.removeProperty('opacity');
		else el.style.opacity = String(value);
	});

	// Tooltip and card render into <body> so they escape `main.app`'s stacking
	// context (z-index 1) and can sit above the fixed prompt bar and the map
	// decorations — while staying under the loader. Positions stay relative to
	// the layer, which is pinned over the container.
	const overlays = createPortal(
		<div
			ref={layerRef}
			className={styles.overlayLayer}
			style={{left: origin.left, top: origin.top, width: size.width, height: size.height}}
		>
			<AnimatePresence>
				{showTooltip && hoveredAnimal && tooltipPosition && (
					<motion.h1
						ref={tooltipRef}
						data-theme={hoveredAnimal.animal.habitats[0]}
						key={hoveredAnimal.animal.slug}
						className={styles.tooltip}
						style={{left: tooltipPosition.left, top: tooltipPosition.top}}
						initial={{opacity: 0, y: reduceMotion ? 0 : 6}}
						animate={{opacity: 1, y: 0}}
						exit={{opacity: 0, y: reduceMotion ? 0 : 6}}
						transition={T.fast}
					>
						{hoveredAnimal.animal.name}
					</motion.h1>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{openAnimal && cardPosition && (
					<motion.div
						ref={cardRef}
						data-theme={openAnimal.animal.habitats[0]}
						key={openAnimal.animal.slug}
						className={styles.card}
						style={{
							left: cardPosition.left,
							top: cardPosition.top,
							width: cardWidth,
							maxHeight: maxCardHeight,
							transformOrigin: cardPosition.opensRight ? 'left center' : 'right center',
						}}
						initial={{opacity: 0, scale: reduceMotion ? 1 : 0.9}}
						animate={{opacity: 1, scale: 1}}
						exit={{opacity: 0, scale: reduceMotion ? 1 : 0.9}}
						transition={{duration: 0.35, ease: EASE_OUT_EXPO}}
					>
						<AnimalCard isReverse onClick={closeCard} animal={openAnimal.animal} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>,
		document.body,
	);

	return (
		<motion.div ref={containerRef} className={styles.container} style={{opacity: mapOpacity}}>
			<div ref={scrollerRef} className={styles.scroller} onScroll={onScroll}>
				<div className={styles.track} style={{width: contentWidth}}>
					<svg
						className={styles.map}
						width={contentWidth}
						height={size.height}
						viewBox={`0 0 ${contentWidth} ${size.height}`}
						aria-hidden="true"
						preserveAspectRatio="none"
					>
						<g className={styles.countries}>
							{paths.map((d, i) => (
								<path key={i} d={d} />
							))}
						</g>
					</svg>

					<div className={styles.waves} aria-hidden="true">
						{placedWaves.map((wave, i) => (
							<img key={i} src={Waves} className={styles.wave} style={{left: wave.x, top: wave.y}} alt="" />
						))}
					</div>

					<div className={styles.markers}>
						<AnimatePresence>
							{placed.map(({animal, x, y}) => (
								<AnimalMarker
									key={animal.slug}
									animal={animal}
									x={x}
									y={y}
									isOpen={openSlug === animal.slug}
									reduceMotion={Boolean(reduceMotion)}
									enterDelay={enterDelays.get(animal.slug) ?? 0}
									onHoverStart={() => setHovered(animal.slug)}
									onHoverEnd={() => setHovered((h) => (h === animal.slug ? null : h))}
									onToggle={() => setOpenSlug((s) => (s === animal.slug ? null : animal.slug))}
								/>
							))}
						</AnimatePresence>
					</div>
				</div>
			</div>

			{overlays}
		</motion.div>
	);
}

export default WorldMap;
