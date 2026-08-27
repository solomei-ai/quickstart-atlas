import {motion, type Variants} from 'motion/react';
import styles from './AnimatedText.module.scss';

export type AnimatedTextProps = {
	readonly children: string;
	readonly className?: string;
	/** Delay before this text starts animating, in milliseconds. */
	readonly delay?: number;
};

const rotations = [-14, 9, -8, 13, -11, 7];

// Per-glyph stagger, in seconds. Matches the previous
// stagger(0.025, {startDelay}) orchestration, which is linear in the
// child index — so every glyph animates at the exact same moment it did
// before, now that the delay lives on the glyph instead of the container.
const stagger = 0.025;

// A stable, deterministic stand-in for each character's key. Keying on the
// character itself collides whenever two different strings share a letter at
// the same position, which stops React from re-animating that span; hashing
// the whole string instead guarantees a fresh key set whenever the text changes.
function hashString(value: string) {
	let hash = 0;
	for (let i = 0; i < value.length; i++) {
		hash = (hash * 31 + value.charCodeAt(i)) | 0;
	}
	return hash;
}

type Glyph = {readonly char: string; readonly index: number};
type Token =
	| {readonly type: 'word'; readonly glyphs: Glyph[]}
	| {readonly type: 'space'; readonly char: string; readonly index: number};

// Group the string into words and the whitespace between them, preserving each
// character's global index. Words become atomic inline-block wrappers so a line
// can only ever break at a space — never mid-word — while each glyph still keeps
// its original index for a consistent rotation and stagger.
function tokenize(text: string): Token[] {
	const tokens: Token[] = [];
	let word: {type: 'word'; glyphs: Glyph[]} | null = null;

	Array.from(text).forEach((char, index) => {
		if (/\s/.test(char)) {
			word = null;
			tokens.push({type: 'space', char, index});
			return;
		}

		if (!word) {
			word = {type: 'word', glyphs: []};
			tokens.push(word);
		}

		word.glyphs.push({char, index});
	});

	return tokens;
}

type CharCustom = {readonly index: number; readonly delay: number};

const char: Variants = {
	hidden: ({index}: CharCustom) => {
		const rotate = rotations[index % rotations.length];

		return {
			opacity: 0,
			rotate,
			x: 90,
			y: rotate * 1.8,
			filter: `blur(0.05em)`,
		};
	},
	animate: ({index, delay}: CharCustom) => ({
		opacity: 1,
		rotate: 0,
		x: 0,
		y: 0,
		filter: `blur(0em)`,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
			type: 'spring',
			delay: Math.max(delay, 0) / 1000 + index * stagger,
		},
	}),
	exit: {
		opacity: 0,
		filter: `blur(0.05em)`,
	},
};

function AnimatedText({children, className, delay = 0}: AnimatedTextProps) {
	const seed = hashString(children);

	return (
		<motion.div
			className={`${styles.container} ${className ?? ''}`}
			initial="hidden"
			animate="animate"
			exit="exit"
		>
			<span className={styles.srOnly}>{children}</span>
			{tokenize(children).map((token) =>
				token.type === 'space' ? (
					<span aria-hidden="true" key={`${seed}-space-${token.index}`}>
						{token.char}
					</span>
				) : (
					<span
						aria-hidden="true"
						className={styles.word}
						key={`${seed}-word-${token.glyphs[0].index}`}
					>
						{token.glyphs.map(({char: character, index}) => (
							<motion.span
								className={styles.char}
								custom={{index, delay}}
								key={`${seed}-${index}`}
								variants={char}
							>
								{character}
							</motion.span>
						))}
					</span>
				),
			)}
		</motion.div>
	);
}

export default AnimatedText;
