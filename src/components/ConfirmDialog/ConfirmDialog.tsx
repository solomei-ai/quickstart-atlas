import styles from './ConfirmDialog.module.scss';
import Button from "../Button/Button.tsx";
import {useTranslation} from "../../i18n/useTranslation.ts";
import { motion } from "motion/react";

type ConfirmDialogProps = {
	readonly variant: 'light' | 'dark';
	readonly title: string;
	readonly message: string;
	readonly onConfirm: () => void;
	readonly onCancel: () => void;
	readonly confirmText?: string;
}

function ConfirmDialog({title, message, onConfirm, onCancel, confirmText, variant='light'}: ConfirmDialogProps) {
	const {t} = useTranslation();

	const variants = {
		hidden: {opacity: 0},
		visible: {opacity: 1}
	}

	return(
		<motion.div
			variants={variants}
			initial="hidden"
			animate="visible"
			exit="hidden"
			tabIndex={0}
			onClick={() => {
				onCancel();
			}}
			className={styles.backdrop}>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`${styles.container} ${styles[variant]}`}>
				<span className={styles.title}>{title}</span>
				<span className={styles.message}>{message}</span>
				<div className={styles.actionsContainer}>
					<Button
						className={styles.fullWidth}
						onClick={onCancel}
						variant={'outline'}>{t('confirmDialog.cancel')}</Button>
					<Button
						className={styles.fullWidth}
						onClick={onConfirm}
						variant={'fill'}>{confirmText ?? t('confirmDialog.confirm')}</Button>
				</div>
			</div>
		</motion.div>
	)
};

export default ConfirmDialog;