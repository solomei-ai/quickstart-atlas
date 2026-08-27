import { useId, type CSSProperties, type ReactNode } from 'react';
import { motion, type Transition } from 'motion/react';

// A serpentine stroke drawn in a 160x90 viewBox. Passes snake from top-left down
// to bottom-right, oscillating like a dragged cloth. Coverage is oversized (rows
// & x-range spill past the box) so once rotated the tilted passes blanket every
// corner — no sliver of the image is left unrevealed. Tuned for strokeWidth ~58.
const WIPE_PATH = (() => {
    const rows = [-40, -6, 28, 62, 96, 130];
    const seg = 14;
    const x0 = -90, x1 = 250;
    let d = '';
    rows.forEach((y, i) => {
        const ltr = i % 2 === 0;
        for (let s = 0; s <= seg; s++) {
            const t = s / seg;
            const x = ltr ? x0 + (x1 - x0) * t : x1 - (x1 - x0) * t;
            const yy = y + Math.sin(t * Math.PI * 3 + i * 1.3) * 4;
            d += `${d ? ' L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)}`;
        }
    });
    return d;
})();

export type ClothWipeProps = {
    /** Image URL that the wipe reveals. Omit to wipe in a flat `paint` colour instead. */
    src?: string;
    /** Colour the cloth is painted with when no `src` is given. Any CSS colour, `var()` included. */
    paint?: string;
    /** Oblique tilt of the wipe, in degrees. 0 = horizontal, 45 = corner-to-corner. */
    angle?: number;
    /** Cloth thickness, in viewBox units (the viewBox is 160x90). */
    strokeWidth?: number;
    /** Wipe length in seconds. */
    duration?: number;
    /** Motion easing for the wipe. */
    ease?: Transition['ease'];
    /** When the overlaid content starts fading in, in seconds (default: 70% of duration). */
    contentDelay?: number;
    /** Applied to the wrapping element. */
    className?: string;
    /** Merged onto the wrapping element (position it here, e.g. inset:0). */
    style?: CSSProperties;
    /** Content overlaid on top of the wiped image; fades in after the wipe. */
    children?: ReactNode;
};

export function ClothWipe({
    src,
    paint = 'var(--color-surface)',
    angle = 28,
    strokeWidth = 58,
    duration = 1.6,
    ease = 'easeInOut',
    contentDelay,
    className,
    style,
    children,
}: ClothWipeProps) {
    const patternId = useId();
    const washId = useId();

    return (
        <div className={className} style={{ position: 'relative', ...style }}>
            <svg
                viewBox="0 0 160 90"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            >
                {src != null && (
                    <defs>
                        {/* Matches the white wash over the app background (Background.module.scss)
                            so the loader texture reads as the same paper, not a starker version of it. */}
                        <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fff" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#fff" stopOpacity={0.35} />
                        </linearGradient>
                        {/* Counter-rotate the pattern space so the image stays upright even though
                            the stroke below it is rotated to sweep the wipe on an oblique angle. */}
                        <pattern
                            id={patternId}
                            patternUnits="userSpaceOnUse"
                            width="160"
                            height="90"
                            patternTransform={`rotate(${-angle} 80 45)`}
                        >
                            <image href={src} x="0" y="0" width="160" height="90" preserveAspectRatio="none" />
                            <rect x="0" y="0" width="160" height="90" fill={`url(#${washId})`} />
                        </pattern>
                    </defs>
                )}
                {/* Visible stroke, painted with the image (or flat `paint` without one);
                    it paints itself on via pathLength. */}
                <motion.path
                    d={WIPE_PATH}
                    transform={`rotate(${angle} 80 45)`}
                    fill="none"
                    stroke={src != null ? `url(#${patternId})` : paint}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration, ease }}
                />
            </svg>

            {children != null && (
                <motion.div
                    style={{ position: 'absolute', inset: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: contentDelay ?? duration * 0.7, duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                    {children}
                </motion.div>
            )}
        </div>
    );
}

export default ClothWipe;
