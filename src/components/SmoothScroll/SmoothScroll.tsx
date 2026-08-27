import {useEffect, useRef, type ReactNode} from 'react';
import {ReactLenis, type LenisRef} from 'lenis/react';
import {cancelFrame, frame} from 'motion/react';

type SmoothScrollProps = {
	readonly children: ReactNode;
};

// App-root smooth scroll. Lenis's own RAF is disabled (`autoRaf: false`) and
// driven from motion's frame loop so Lenis and any `useScroll`/`scrollYProgress`
// share one clock — no per-frame jitter when scroll-linked motion is added.
function SmoothScroll({children}: SmoothScrollProps) {
	const lenisRef = useRef<LenisRef>(null);

	useEffect(() => {
		function update(data: {timestamp: number}) {
			lenisRef.current?.lenis?.raf(data.timestamp);
		}

		frame.update(update, true);
		return () => cancelFrame(update);
	}, []);

	return (
		<ReactLenis
			root
			ref={lenisRef}
			options={{
				autoRaf: false,
				// 0.08 = a heavier, more deliberate glide than the 0.1 default —
				// reads as expensive without feeling sluggish.
				lerp: 0.08,
				duration: 1.2,
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 1.5,
			}}
		>
			{children}
		</ReactLenis>
	);
}

export default SmoothScroll;
