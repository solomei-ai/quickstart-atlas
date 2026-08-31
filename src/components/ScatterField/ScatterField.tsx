import {useId, useLayoutEffect, useRef, useState, type CSSProperties} from 'react';
import styles from './ScatterField.module.scss';
import type {ThemeAsset} from '../../assets/themeAssets/themeAsset.ts';

/**
 * Deterministic PRNG. Which asset lands in which slot has to survive a resize —
 * the field rescales, it never reshuffles — so nothing here may read Math.random.
 */
function mulberry32(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function hashSeed(seed: string) {
	let hash = 2166136261;
	for (let index = 0; index < seed.length; index += 1) {
		hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619);
	}
	return hash >>> 0;
}

/**
 * Deals from a shuffled deck, reshuffling a fresh copy whenever it empties. Independent
 * random picks clump badly at this scale — six assets over a dozen slots left one appearing
 * eight times and another once. Dealing guarantees every asset is spent before any repeats.
 */
function dealer(pool: readonly string[], random: () => number) {
	let deck: string[] = [];
	return () => {
		if (deck.length === 0) {
			deck = [...pool];
			for (let index = deck.length - 1; index > 0; index -= 1) {
				const swap = Math.floor(random() * (index + 1));
				[deck[index], deck[swap]] = [deck[swap], deck[index]];
			}
		}
		return deck.pop() as string;
	};
}

/** A group's part in the field. */
export type ScatterGroup = {
	/** Key into `assets`. */
	readonly key: string;
	/**
	 * Size multiplier for this group. Groups rarely fill their frame equally, and where they do not,
	 * equal slot sizes render visibly unequal art. This is the correction — though for well-cropped
	 * art of consistent ink density (as Canopy's is) it is art direction rather than a fix.
	 *
	 * This is about framing only. It is not a knob for opacity, colour or contrast: art that reads
	 * too faint or too grey on the line is an export problem, to be fixed in the file rather than
	 * compensated for here.
	 */
	readonly scale?: number;
};

/**
 * Two different units are in play here, and the distinction is the whole reason the field survives
 * an ultrawide viewport:
 *
 * - `t` walks the spine, whose sideways sweep is measured in **container widths** — the S always
 *   spans the section, however wide it gets.
 * - `size` and `off` are measured in **basis widths**, where the basis is the container width
 *   *clamped* to `maxScaleWidth`. Art and local composition stop growing past that clamp.
 *
 * Tying art size to the container instead would upscale it without limit: at 2560px a 0.42 slot is
 * a 1075px box drawn from a ~540px source, which visibly softens. Past the clamp the section gets a
 * longer, flatter S with *more* elements along it rather than the same few blown up.
 */
type Slot = {
	/** Position along the spine, 0 at the tile's top edge, 1 one full S-period down. */
	readonly t: number;
	/** Nudge sideways off the spine, in basis widths. May push past an edge, which crops. */
	readonly off: number;
	/** Longest edge of the asset, in basis widths. */
	readonly size: number;
	/** Degrees, clockwise. */
	readonly rot: number;
};

// How far the spine swings either side of the section's centre line, in container widths. At
// 0.42 the arms reach x 0.08 and 0.92, so a chain sweeps almost the whole width before turning.
const AMPLITUDE = 0.42;

// Redistributes the vertical run so the arms flatten and the turns steepen — without it the
// arms read as even diagonals rather than the long horizontal sweeps of the reference print.
// Must stay under 1 / 4π ≈ 0.0796 or dy/dt goes negative and the curve doubles back.
const ARM_FLATTEN = 0.06;

// One sine period per tile means the motif is continuous across the seam by construction:
// x and y both repeat with matching tangents at t = 0 and t = 1, so nothing needs fitting.
function spineX(t: number) {
	return 0.5 + AMPLITUDE * Math.sin(2 * Math.PI * t);
}

function spineY(t: number) {
	return t - ARM_FLATTEN * Math.sin(4 * Math.PI * t);
}

// Where an arm stops and the turn begins. Its x, +/- about the centre line, bounds the chain.
const ARM_END_T = 0.1575;

// Centre-to-centre spacing along an arm, in basis widths. At 0.234 against a ~0.40 size,
// consecutive elements overlap by roughly a third: chained, but each still readable.
const CHAIN_STEP = 0.234;

// Cycled along each arm so a chain of any length keeps varying. Four entries reproduces the
// hand-authored four-element arm exactly at the basis width.
const CHAIN_SIZES = [0.42, 0.38, 0.43, 0.39];
const CHAIN_ROTATIONS = [-14, 12, -8, 20];
const CHAIN_OFFSETS = [-0.02, +0.03, -0.03, +0.02];

/** t at which the spine crosses a given x. Only valid on an arm, where x is monotonic in t. */
function armT(x: number) {
	return Math.asin((x - 0.5) / AMPLITUDE) / (2 * Math.PI);
}

/**
 * The art direction. There is exactly one S across the section, so a `size` of 0.42 is 42% of the
 * basis width — the reference's leaves run about a third of its width, and they are the subject,
 * not a texture.
 *
 * The line runs in overlapping chains along the two arms (centred on t = 0 and t = 0.5, where the
 * curve moves fastest sideways), one element closing each turn, and a smaller pair tucked into each
 * concave pocket. Chain elements are spaced evenly **in x**, not in t: stepping t uniformly bunches
 * them toward the lobes, where the sine slows to a stop sideways.
 *
 * Arm length is driven by the container while element spacing is driven by the basis, so a wider
 * section gets more elements per arm instead of larger ones. That is what keeps the art at its
 * native resolution on an ultrawide display.
 *
 * Every element is full strength, and nothing here dims or shadows anything. The Canopy art carries
 * its own cast shadow — every file has a semi-transparent grey shadow shape baked in, 10-24% of its
 * visible pixels — so a rendered drop shadow would double it, and a dimmed layer of faint art behind
 * the line reads as washed out rather than as depth.
 *
 * **Slots come out ordered along the curve, and that order is load-bearing**: groups rotate in slot
 * order, so walking the curve is what makes the alternation follow the line rather than scatter.
 *
 * Note `size` is the *box*, and the art carries transparent margins, so visible art runs under the
 * number here: sizes that look overlapping on paper can render as separate elements.
 */
function slotsFor(width: number, basis: number): Slot[] {
	const reach = AMPLITUDE * Math.sin(2 * Math.PI * ARM_END_T);
	const [xLeft, xRight] = [0.5 - reach, 0.5 + reach];

	// Gaps, not elements: a 4-element arm has 3. Spacing is in basis widths but the span to cover is
	// in container widths, so this grows as the section outruns the basis.
	const gaps = Math.max(3, Math.round(((xRight - xLeft) * width) / (CHAIN_STEP * basis)));

	const arm = (from: number, to: number, tOf: (x: number) => number, phase: number): Slot[] =>
		Array.from({length: gaps + 1}, (_, index) => {
			const x = from + ((to - from) * index) / gaps;
			const cycle = (index + phase) % CHAIN_SIZES.length;
			return {
				t: tOf(x),
				off: CHAIN_OFFSETS[cycle],
				size: CHAIN_SIZES[cycle],
				rot: CHAIN_ROTATIONS[cycle],
			};
		});

	return [
		// Upper arm, sweeping left to right across the seam.
		...arm(xLeft, xRight, armT, 0),
		// Pocket inside the right-hand turn: smaller, tucked into the curve's concave side.
		{t: 0.215, off: -0.32, size: 0.28, rot: -8},
		// One element at the outer edge of the turn, closing the curve. Only one: the two arm ends
		// already sit at nearly this x, and a third here stacks them into a vertical clump that
		// reads as a column and kills the horizontal sweep.
		{t: 0.25, off: +0.04, size: 0.40, rot: -24},
		{t: 0.295, off: -0.27, size: 0.26, rot: 12},
		// Lower arm, sweeping back right to left. Phased so it does not echo the upper arm.
		...arm(xRight, xLeft, x => 0.5 - armT(x), 2),
		// Pocket inside the left-hand turn.
		{t: 0.715, off: +0.33, size: 0.26, rot: 6},
		{t: 0.75, off: -0.04, size: 0.38, rot: 17},
		{t: 0.795, off: +0.28, size: 0.28, rot: -11},
	];
}

type Placement = {
	readonly href: string;
	readonly x: number;
	readonly y: number;
	readonly size: number;
	readonly rot: number;
	readonly mirror: boolean;
};

// Bounding-circle radius of a square rotated by an arbitrary angle, as a fraction of its edge.
const CORNER_REACH = 0.71;

/**
 * A section is landscape on a desktop and strongly portrait on a phone, so a period fixed as a
 * fraction of the width stacks three or four S-curves onto a phone screen while a desktop shows
 * one. Stretching the period as the viewport narrows keeps curves-per-screen roughly steady.
 *
 * Interpolated across the range rather than stepped at a breakpoint, so a drag-resize glides
 * instead of jumping — the motif is still the same drawing at every width, just differently
 * proportioned.
 */
const NARROW_WIDTH = 375;
const WIDE_WIDTH = 1024;
const NARROW_STRETCH = 1.9;

function periodFor(base: number, width: number) {
	const progress = Math.min(1, Math.max(0, (width - NARROW_WIDTH) / (WIDE_WIDTH - NARROW_WIDTH)));
	return base * (NARROW_STRETCH + (1 - NARROW_STRETCH) * progress);
}

/**
 * One S per container width, in px. Everything is expressed as a fraction of `width`, so the
 * motif is the same drawing at every viewport and only its scale changes — no breakpoints,
 * no strip count, nothing that steps or reflows on resize.
 */
function placementsFor(
	assets: ThemeAsset,
	groups: readonly ScatterGroup[],
	seed: string,
	width: number,
	basis: number,
	tileHeight: number,
	scale: number,
): Placement[] {
	const random = mulberry32(hashSeed(seed));

	const rotation = groups.filter(group => assets[group.key]?.length);
	if (rotation.length === 0) return [];

	// One deck per group, so each keeps cycling its own art evenly across however many slots the
	// rotation hands it.
	const deals = new Map<string, () => string>();
	const dealFrom = (group: ScatterGroup) => {
		let deal = deals.get(group.key);
		if (!deal) {
			deal = dealer(assets[group.key], random);
			deals.set(group.key, deal);
		}
		return deal();
	};

	return slotsFor(width, basis).map((slot, index) => {
		const group = rotation[index % rotation.length];
		return {
			href: dealFrom(group),
			// Spine in container widths, everything local in basis widths — see `Slot`.
			x: spineX(slot.t) * width + slot.off * basis,
			y: spineY(slot.t) * tileHeight,
			size: slot.size * (group.scale ?? 1) * scale * basis,
			rot: slot.rot,
			mirror: random() < 0.5,
		};
	});
}

/**
 * Every vertical copy of a placement that overlaps the tile. Assets are large enough to cross
 * the tile's top and bottom edges, and a pattern that does not repeat those crossings on the
 * opposite edge seams as it repeats down the section.
 *
 * Horizontally there is deliberately no wrap. The tile is exactly the container width, so its
 * left and right edges *are* the section's edges: art that runs past them is cropped, the way
 * the reference print is cropped at the paper's edge. Wrapping instead would slide a leaf's
 * missing half onto the far side of the section.
 */
function wrap(placement: Placement, tileHeight: number): Placement[] {
	const reach = placement.size * CORNER_REACH;
	const copies: Placement[] = [];
	for (let row = -1; row <= 1; row += 1) {
		const y = placement.y + row * tileHeight;
		if (y + reach > 0 && y - reach < tileHeight) copies.push({...placement, y});
	}
	return copies;
}

function Asset({href, x, y, size, rot, mirror}: Placement) {
	return (
		<g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot})${mirror ? ' scale(-1 1)' : ''}`}>
			<image
				href={href}
				className={styles.asset}
				x={-size / 2}
				y={-size / 2}
				width={size}
				height={size}
				preserveAspectRatio="xMidYMid meet"
			/>
		</g>
	);
}

type ScatterFieldProps = {
	/** Asset groups to draw from. */
	readonly assets: ThemeAsset;
	/**
	 * Which groups take part and in what order they rotate along the line. Defaults to every
	 * group in `assets`, in declaration order — so by default the curve alternates through all
	 * of a theme's art rather than repeating one type.
	 */
	readonly groups?: readonly ScatterGroup[];
	/** Keys the asset-to-slot assignment. The same seed always yields the same field. */
	readonly seed?: string;
	/**
	 * Height of one S, as a multiple of the container width, at desktop widths — narrower
	 * viewports stretch it automatically, see `periodFor`. Higher opens gaps between the curve's
	 * arms; lower packs them. The default is well under 1 because a section is landscape while
	 * the reference print is portrait: at 1, a single S is taller than a desktop viewport and
	 * you see one arm and a void instead of the weave.
	 */
	readonly period?: number;
	/** Multiplier on every asset size. The dial for "bigger" without touching the layout. */
	readonly scale?: number;
	/**
	 * Container width, in px, past which the art stops growing. Beyond it the S still spans the
	 * section but gains more elements rather than larger ones, so the art never has to be upscaled
	 * far past its native resolution. Raise it only as far as the source art can carry: Canopy's
	 * leaves are around 540px on their long edge, and the default already asks for a ~605px box.
	 */
	readonly maxScaleWidth?: number;
	readonly className?: string;
};

function ScatterField({
	assets,
	groups,
	seed = 'scatter',
	period = 0.6,
	scale = 1,
	maxScaleWidth = 1440,
	className,
}: ScatterFieldProps) {
	// `useId` returns a colon-bearing string, which is not valid in a fragment identifier.
	const uid = useId().replace(/:/g, '');
	const ref = useRef<SVGSVGElement>(null);
	const [width, setWidth] = useState(0);

	// Width only: the section's height stays unknown and unmeasured, because the pattern
	// covers it whatever it turns out to be.
	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;
		const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	const patternId = `scatter-${uid}`;

	// The tile is the full container width: one S across the section, repeating only downward.
	// Art scales with the clamped basis rather than the raw width, so it stops growing — but the
	// tile stays as wide as the section, which is what keeps it a single line.
	const basis = Math.min(width, maxScaleWidth);
	// Height follows the basis too, so vertical rhythm holds steady and a wide section simply gets a
	// longer, flatter S rather than a taller one.
	const tileHeight = basis * periodFor(period, width);
	const rotation = groups ?? Object.keys(assets).map(key => ({key}));

	// Kept in slot order, so the line overlaps the way it is authored: each element sits over the
	// one before it along the curve.
	const placed = placementsFor(assets, rotation, seed, width, basis, tileHeight, scale);

	// How far the field has to overhang the section so its edges cut nothing: the reach of the
	// largest element actually placed. Measured off the placements rather than the authored slot
	// sizes, so it stays right when `scale`, the basis or the art direction change.
	const bleed = placed.reduce((largest, placement) => Math.max(largest, placement.size), 0) * CORNER_REACH;

	const placements = placed.flatMap(placement => wrap(placement, tileHeight));

	return (
		<svg
			ref={ref}
			className={className ? `${styles.field} ${className}` : styles.field}
			style={{'--scatter-bleed': `${bleed.toFixed(2)}px`} as CSSProperties}
			aria-hidden="true"
			focusable="false"
		>
			{width > 0 && (
				<>
					<defs>
						<pattern
							id={patternId}
							width={width}
							// The bleed moved the SVG's origin up above the section, so the tiling origin is
							// pushed back down by the same amount: the composition stays pinned to the
							// section's top edge and the overhang is purely additive.
							y={bleed}
							height={tileHeight}
							patternUnits="userSpaceOnUse"
						>
							{placements.map((placement, index) => <Asset key={index} {...placement} />)}
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill={`url(#${patternId})`}/>
				</>
			)}
		</svg>
	);
}

export default ScatterField;
