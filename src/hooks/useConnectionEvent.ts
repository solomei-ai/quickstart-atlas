import {useRef} from "react";
import {SLInputEventType, UserInteractionType, useOnConnectionChange, useThamyr} from "@solomei-ai/thamyr-react";

/** Fires the "connection" customInteraction round once, as soon as Thamyr connects — seeds the discoveryFeed custom landing. */
function useConnectionEvent() {
	const {sendEvent} = useThamyr();
	const hasFired = useRef(false);

	useOnConnectionChange((status) => {
		if (status !== 'connected' || hasFired.current) return;
		hasFired.current = true;
		sendEvent(UserInteractionType.CREATE_ROUND, {
			inputEvent: {type: SLInputEventType.customInteraction, data: {interactionId: 'connection'}},
		});
	});
}

export default useConnectionEvent;
