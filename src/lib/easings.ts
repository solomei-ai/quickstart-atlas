// Premium easing curves and transition presets for motion/react.
//
// The defining trait of "expensive" motion is a hard deceleration: things move
// in fast and settle gently. Expo-out ([0.16, 1, 0.3, 1]) is the workhorse.

import type { Transition } from 'motion/react';

// --- Cubic-bezier curves -----------------------------------------------------

/** Fast in, long gentle settle. The default for reveals and most motion. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Symmetric ease for things that move and stop in place (toggles, layout). */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Slight overshoot — playful, good for badges/pills appearing. Use sparingly. */
export const EASE_BACK_OUT = [0.34, 1.56, 0.64, 1] as const;

// --- Transition presets ------------------------------------------------------

export const T = {
	/** Micro-interactions: hover, tap, small toggles. */
	fast: { duration: 0.3, ease: EASE_OUT_EXPO },
	/** Standard entrance reveals. */
	smooth: { duration: 0.8, ease: EASE_OUT_EXPO },
	/** Larger / hero reveals that should feel weighty. */
	slow: { duration: 1.1, ease: EASE_OUT_EXPO },
	spring: { duration: 0.47, type: 'spring', bounce: 0.35 },
	lightBounce: {duration: 0.7, type: 'spring', bounce: 0.29}
} satisfies Record<string, Transition>;
