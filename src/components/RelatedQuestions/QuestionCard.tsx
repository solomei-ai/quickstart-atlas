import styles from './RelatedQuestions.module.scss';
import {SLInputEventType, UserInteractionType, useThamyr} from "@solomei-ai/thamyr-react";
import {useLoadingStore} from "../../stores/loadingStore.ts";
import {useHistoryStore} from "../../stores/historyStore.ts";
import {useStoryStore} from "../../stores/storyStore.ts";

export type QuestionCardType = {
	readonly title: string;
	readonly text: string;
}

function QuestionCard({title, text}: QuestionCardType) {

	const {sendEvent} = useThamyr();
	const {setIsLoading, setIsGenerating} = useLoadingStore();
	const addInteraction = useHistoryStore(state => state.addInteraction);
	const currentStoryId = useStoryStore(state => state.currentStoryId);

	function handleClick() {
		setIsLoading(true);
		setIsGenerating(true);
		addInteraction({id: crypto.randomUUID(), interactionType: 'search', target: 'related', label: title});
		sendEvent(UserInteractionType.CREATE_ROUND, {
			// Thread the story id so this round continues the session's story.
			storyId: currentStoryId ?? undefined,
			inputEvent: {type: SLInputEventType.question, data: {value: title}},
		});
	}

	return(
		<button
			type={'button'}
			aria-label={title}
			onClick={handleClick}
			className={styles.questionCardContainer}>
			<p className={styles.questionCardTitle}>{title}</p>
			<p className={styles.questionCardText}>{text}</p>
		</button>
	)
}

export default QuestionCard;