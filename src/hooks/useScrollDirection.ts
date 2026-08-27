import {useState} from "react";
import {useMotionValueEvent, useScroll} from "motion/react";

export type ScrollDirection = "up" | "down";

export function useScrollDirection(): ScrollDirection {
	const {scrollY} = useScroll();
	const [direction, setDirection] = useState<ScrollDirection>("up");

	useMotionValueEvent(scrollY, "change", (current) => {
		const previous = scrollY.getPrevious() ?? current;
		setDirection(current > previous ? "down" : "up");
	});

	return direction;
}
