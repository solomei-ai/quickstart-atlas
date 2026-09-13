import {AnimatePresence, motion} from "motion/react";
import Markdown from "react-markdown";
import styles from './TextResponse.module.scss';

type TextResponseProps = {
	readonly title: string;
	readonly text: string;
}

function TextResponse({title, text}: TextResponseProps) {
	const hasTitle = title !== 'undefined' && title !== '';
	return (
		<div className={styles.container}>
			<AnimatePresence>
				<h2 key="title">{hasTitle ? title : ''}</h2>
				<motion.div key="text" className={styles.text} initial={false} layout={'position'} layoutDependency={hasTitle}><Markdown>{text}</Markdown></motion.div>
			</AnimatePresence>
		</div>
	)
}

export default TextResponse;
