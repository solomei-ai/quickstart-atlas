import styles from "./StatCard.module.scss";
import type {ReactNode} from "react";
import Button from "../Button/Button.tsx";

export type StatCardType = {
	readonly title: string;
	readonly action: () => void;
	readonly content: ReactNode;
}

function StatCard({title, action, content}: StatCardType) {
	return(
		<div className={styles.container}>
			<div className={styles.header}>
				<span>{title}</span>
				<Button
					variant={'outline'}
					icon={'Plus'}
					onClick={action}/>
			</div>
			<div className={styles.contentContainer}>
				{content}
			</div>
		</div>
	);
}

export default StatCard;