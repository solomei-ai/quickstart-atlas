import styles from './PromptBar.module.scss';
import {useState, type KeyboardEvent} from "react";
import Icon from "../Icon/Icon.tsx";
import {useTranslation} from "../../i18n/useTranslation.ts";
import useMeasure from 'react-use-measure';
import {AnimatePresence, motion} from "motion/react";
import {T} from "../../lib/easings.ts";
import ProgressLoader from "../Loading/ProgressLoader.tsx";


type PromptBarProps = {
	readonly isDisabled?: boolean;
	readonly isLoading?: boolean;
	readonly onIntentPress: () => void;
	readonly onSend?: (text: string) => void;
}

function PromptBar({isDisabled, isLoading, onIntentPress, onSend}: PromptBarProps) {
	const {t} = useTranslation();
	const [input, setInput] = useState('');

	const variants = {
		visible: {
			opacity: 1,
			filter: "blur(0px)",
		},
		hidden: {
			opacity: 0,
			filter: "blur(8px)"
		}

	}

	function handleSend() {
		const text = input.trim();
		if (!text || isDisabled) return;
		onSend?.(text);
		setInput('');
	}

	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key !== 'Enter' || isDisabled) return;

		if (e.altKey) {
			// Option+Enter: insert a newline manually (browsers don't do this natively)
			e.preventDefault();
			const target = e.currentTarget;
			const {selectionStart, selectionEnd} = target;
			const next = input.slice(0, selectionStart) + '\n' + input.slice(selectionEnd);
			setInput(next);
			// Restore the caret right after the inserted newline
			requestAnimationFrame(() => {
				target.selectionStart = target.selectionEnd = selectionStart + 1;
			});
			return;
		}

		if (!e.shiftKey) {
			// Enter: send. (Shift+Enter falls through to the native newline.)
			e.preventDefault();
			handleSend();
		}
	}
	const [ref, bounds] = useMeasure()

	return (
		<motion.div
			className={styles.container}
			initial={false}
			animate={{
				height: bounds.height || 'auto',
				width: bounds.width || 'auto',
			}}
			transition={T.lightBounce}>
			<div className={styles.content} ref={ref}>
				<AnimatePresence mode={'wait'}>
				{isLoading ? (
					<div className={styles.loaderContainer}>
						<ProgressLoader isFixed={false}/>
					</div>
				) : (
					<>
						<motion.div
							variants={variants}
							initial="hidden"
							animate="visible"
							exit={"hidden"}
							transition={T.slow}
							className={styles.inputContainer}>
							<textarea
								placeholder={t('promptBar.placeholder')}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								className={styles.input}
								rows={1}
							/>
							<button
								onClick={handleSend}
								disabled={!input.trim() || isDisabled}
								className={styles.sendBtn}>
								<Icon icon={'Send'} size={16} color={'currentColor'}/>
							</button>
						</motion.div>
						<div className={styles.actionsContainer}>
							<button
								type="button"
								data-intent-trigger
								onClick={onIntentPress}
								className={styles.promptBtn}>
								<Icon icon={'Paw'} size={16} color={'currentColor'}/>
							</button>
						</div>
					</>
				)}
				</AnimatePresence>
			</div>
		</motion.div>
	)
}

export default PromptBar;