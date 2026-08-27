import styles from './FactSection.module.scss';
import Markdown from "react-markdown";

type FactSectionProps = {
	readonly title: string;
	readonly description: string;
	readonly titleSize?: 'regular' | 'large';
}

function FactSection({title, description, titleSize = 'regular'}: FactSectionProps) {

	const titleClassName = titleSize === 'large' ? styles.largeTitle : undefined;

	return (
		<div className={styles.container}>
			<h3 className={titleClassName}>
				<Markdown components={{p: ({children}) => <>{children}</>}}>{title}</Markdown>
			</h3>
			<p>{description}</p>
		</div>
	)
}

export default FactSection