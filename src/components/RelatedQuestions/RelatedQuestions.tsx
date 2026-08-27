import styles from './RelatedQuestions.module.scss';
import QuestionCard, { type QuestionCardType} from "./QuestionCard.tsx";
import {useTranslation} from "../../i18n/useTranslation.ts";
import {AnimatePresence, motion} from "motion/react";

type RelatedQuestionsProps = {
	questions: QuestionCardType[];
	visible?: boolean;
}

function RelatedQuestions({questions, visible = true}: RelatedQuestionsProps) {
	const {t} = useTranslation();
	const variants = {
		hidden: {opacity: 0},
		visible: {opacity: 1},
	}
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key='related-questions'
					variants={variants}
					initial='hidden'
					animate='visible'
					exit='hidden'
					transition={{duration: 0.5}}
					className={styles.relatedQuestionsContainer}>
					<h2>{t('related_questions.still_curios')}</h2>
					<div className={styles.questionCards}>
						{questions.map((question, index) => (
							<QuestionCard key={index} title={question.title} text={question.text} />
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default RelatedQuestions;