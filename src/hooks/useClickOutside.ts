import {useEffect, useRef, type RefObject} from 'react';

type UseClickOutsideOptions = {
	// When false the listener isn't attached (e.g. nothing is open to dismiss).
	readonly enabled?: boolean;
	// CSS selectors treated as "inside" even though they live outside the ref's
	// subtree — a pointerdown matching any of them won't trigger `handler`.
	readonly ignore?: readonly string[];
};

/**
 * Runs `handler` on a pointerdown that lands outside the returned ref's element
 * (and outside any `ignore` selector). Attach the returned ref to the element
 * that should count as "inside".
 */
export function useClickOutside<T extends HTMLElement>(
	handler: () => void,
	{enabled = true, ignore = []}: UseClickOutsideOptions = {},
): RefObject<T | null> {
	const ref = useRef<T>(null);
	// Depend on a stable string rather than the array's identity, so passing an
	// inline `ignore` array doesn't re-subscribe the listener on every render.
	const ignoreKey = ignore.join('|');

	useEffect(() => {
		if (!enabled) return;
		const selectors = ignoreKey ? ignoreKey.split('|') : [];
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;
			if (ref.current?.contains(target)) return;
			if (selectors.some((selector) => target.closest(selector))) return;
			handler();
		};
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	}, [handler, enabled, ignoreKey]);

	return ref;
}
