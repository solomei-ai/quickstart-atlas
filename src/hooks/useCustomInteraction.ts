import {SLInputEventType, UserInteractionType, useThamyr} from "@solomei-ai/thamyr-react";
import {useLoadingStore} from "../stores/loadingStore.ts";
import {useHistoryStore} from "../stores/historyStore.ts";
import {useStoryStore} from "../stores/storyStore.ts";
import type {InputTarget} from "../components/History/history.ts";

type useCustomInteractionPayload = {
	// Thamyr custom interaction id sent with the round (e.g. 'animalClick').
	readonly interactionId: string;
	// History target this interaction is recorded under.
	readonly target: InputTarget;
	readonly onClick?: () => void;
}

// Fires a Thamyr custom interaction round for a clicked value and records it in
// the visitor's history. The interactionId/target pair is what specialises each
// call site (animal, tag, habitat, size, …).
function useCustomInteraction({interactionId, target, onClick}: useCustomInteractionPayload) {
	const {sendEvent} = useThamyr();
	const {setIsGenerating, setIsLoading} = useLoadingStore();
	const addInteraction = useHistoryStore(state => state.addInteraction);
	const currentStoryId = useStoryStore(state => state.currentStoryId);

	function handleClick(value: string) {
		setIsLoading(true);
		setIsGenerating(true);
		onClick?.();
		addInteraction({id: crypto.randomUUID(), interactionType: 'click', target, label: value});
		sendEvent(UserInteractionType.CREATE_ROUND, {
			// Thread the story id so this round continues the session's story.
			storyId: currentStoryId ?? undefined,
			inputEvent: {type: SLInputEventType.customInteraction, data: {interactionId, value}},
		});
	}

	return {handleClick}
}

export default useCustomInteraction;
