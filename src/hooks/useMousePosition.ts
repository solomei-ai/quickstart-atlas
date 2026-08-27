import {useEffect, useState} from 'react';

export type MousePosition = {x: number; y: number};

/**
 * Tracks the pointer's viewport coordinates (clientX/clientY), updated on every
 * `mousemove`. Starts at {x: 0, y: 0} until the pointer first moves.
 */
export function useMousePosition(): MousePosition {
	const [position, setPosition] = useState<MousePosition>({x: 0, y: 0});

	useEffect(() => {
		const onMove = (event: MouseEvent) => setPosition({x: event.clientX, y: event.clientY});
		window.addEventListener('mousemove', onMove);
		return () => window.removeEventListener('mousemove', onMove);
	}, []);

	return position;
}
